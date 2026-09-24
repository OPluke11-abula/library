#!/usr/bin/env python3
"""
scripts/validate_library.py
===========================
Automated integrity validator for the Computer Science & Deep Learning Knowledge Base.
Validates:
  1. Call-number formats and bilingual pairing (ZH / EN).
  2. Frontmatter validity and canonical status taxonomy.
  3. DAG topological consistency (no cycles, no broken refs, symmetric edges).
  4. Invariant accounting (no duplicate IDs, matching frontmatter invariants_count, bilingual parity).
  5. Internal Wikilinks and relative Markdown link integrity.
  6. Detection of stale repository claims.

Returns exit code 0 on complete pass, 1 on failure.
"""

import sys
import os
import re
import json
import urllib.parse
from pathlib import Path
from collections import defaultdict, deque

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

ROOT = Path(__file__).resolve().parent.parent

CANONICAL_STATUS_TAXONOMY = {
    'draft',
    'reviewed',
    'source-verified',
    'experiment-verified',
    'production-validated'
}

def parse_frontmatter(text: str):
    """Parses standard YAML frontmatter into a dict and body string."""
    if not text.startswith('---'):
        return {}, text
    parts = text.split('---', 2)
    if len(parts) < 3:
        return {}, text
    fm_text = parts[1]
    body = parts[2]
    
    data = {}
    current_key = None
    current_list = None
    
    for raw_line in fm_text.splitlines():
        line = raw_line.strip()
        if not line or line.startswith('#'):
            continue
        
        if line.startswith('- '):
            val = line[2:].strip().strip('"').strip("'")
            if current_list is not None:
                current_list.append(val)
            continue
            
        if ':' in line:
            k, v = line.split(':', 1)
            k = k.strip()
            v = v.strip()
            if not v:
                current_key = k
                current_list = []
                data[k] = current_list
            else:
                current_key = None
                current_list = None
                if (v.startswith('"') and v.endswith('"')) or (v.startswith("'") and v.endswith("'")):
                    v = v[1:-1]
                elif v.isdigit():
                    v = int(v)
                elif v.lower() == 'true':
                    v = True
                elif v.lower() == 'false':
                    v = False
                data[k] = v
                
    return data, body

def find_library_files():
    zh_files = {}
    en_files = {}
    
    for p in ROOT.rglob('*.md'):
        rel = p.relative_to(ROOT)
        rel_str = str(rel).replace('\\', '/')
        if '_archive_legacy' in rel_str or '.obsidian' in rel_str:
            continue
        m = re.search(r'(LIB-\d{3})', p.name)
        if m:
            call_no = m.group(1)
            if rel_str.startswith('en/'):
                en_files[call_no] = rel
            else:
                zh_files[call_no] = rel
                
    return zh_files, en_files

def validate_all():
    errors = []
    warnings = []
    
    zh_files, en_files = find_library_files()
    all_call_numbers = sorted(set(zh_files.keys()) | set(en_files.keys()))
    
    print(f"=== Knowledge Base Integrity Validation ===")
    print(f"Discovered {len(all_call_numbers)} unique volumes:")
    print(f"  Chinese volumes: {len(zh_files)}")
    print(f"  English volumes: {len(en_files)}")
    
    # 1. Call number format and bilingual pairing
    for cid in all_call_numbers:
        if not re.match(r'^LIB-\d{3}$', cid):
            errors.append(f"Invalid call number format: '{cid}'")
        if cid not in zh_files:
            errors.append(f"Missing Chinese edition for volume: {cid}")
        if cid not in en_files:
            errors.append(f"Missing English edition for volume: {cid}")
            
    # Parse all documents
    zh_docs = {}
    en_docs = {}
    for cid in all_call_numbers:
        if cid in zh_files:
            p = ROOT / zh_files[cid]
            fm, body = parse_frontmatter(p.read_text(encoding='utf-8'))
            zh_docs[cid] = {'path': p, 'fm': fm, 'body': body}
        if cid in en_files:
            p = ROOT / en_files[cid]
            fm, body = parse_frontmatter(p.read_text(encoding='utf-8'))
            en_docs[cid] = {'path': p, 'fm': fm, 'body': body}
            
    # 2. Frontmatter status and structure
    for lang, docs in [('ZH', zh_docs), ('EN', en_docs)]:
        for cid, d in docs.items():
            fm = d['fm']
            status = fm.get('status')
            if not status:
                errors.append(f"[{lang} {cid}] Missing 'status' in frontmatter")
            elif status not in CANONICAL_STATUS_TAXONOMY:
                errors.append(f"[{lang} {cid}] Invalid status '{status}'. Must be one of: {sorted(CANONICAL_STATUS_TAXONOMY)}")
                
            decl_c = fm.get('call_number') or fm.get('id')
            if decl_c != cid:
                errors.append(f"[{lang} {cid}] Frontmatter call_number '{decl_c}' does not match file ID '{cid}'")

    # 3. DAG Topological Consistency
    # Check prerequisites and successors
    prereq_graph_zh = defaultdict(set)
    succ_graph_zh = defaultdict(set)
    prereq_graph_en = defaultdict(set)
    succ_graph_en = defaultdict(set)
    
    for cid, d in zh_docs.items():
        for p in (d['fm'].get('prerequisites') or []):
            m = re.search(r'(LIB-\d{3})', p)
            if m:
                target = m.group(1)
                if target not in all_call_numbers:
                    errors.append(f"[ZH {cid}] Broken prerequisite reference: {p}")
                else:
                    prereq_graph_zh[cid].add(target)
        for s in (d['fm'].get('successors') or []):
            m = re.search(r'(LIB-\d{3})', s)
            if m:
                target = m.group(1)
                if target not in all_call_numbers:
                    errors.append(f"[ZH {cid}] Broken successor reference: {s}")
                else:
                    succ_graph_zh[cid].add(target)

    for cid, d in en_docs.items():
        for p in (d['fm'].get('prerequisites') or []):
            m = re.search(r'(LIB-\d{3})', p)
            if m:
                target = m.group(1)
                if target not in all_call_numbers:
                    errors.append(f"[EN {cid}] Broken prerequisite reference: {p}")
                else:
                    prereq_graph_en[cid].add(target)
        for s in (d['fm'].get('successors') or []):
            m = re.search(r'(LIB-\d{3})', s)
            if m:
                target = m.group(1)
                if target not in all_call_numbers:
                    errors.append(f"[EN {cid}] Broken successor reference: {s}")
                else:
                    succ_graph_en[cid].add(target)

    # Check bilingual parity of DAG
    for cid in all_call_numbers:
        if prereq_graph_zh[cid] != prereq_graph_en[cid]:
            errors.append(f"Prerequisite mismatch between ZH and EN for {cid}: ZH={sorted(prereq_graph_zh[cid])} vs EN={sorted(prereq_graph_en[cid])}")
        if succ_graph_zh[cid] != succ_graph_en[cid]:
            errors.append(f"Successor mismatch between ZH and EN for {cid}: ZH={sorted(succ_graph_zh[cid])} vs EN={sorted(succ_graph_en[cid])}")

    # Check edge symmetry: u in prereq(v) <=> v in succ(u)
    for cid in all_call_numbers:
        for pre in prereq_graph_zh[cid]:
            if cid not in succ_graph_zh[pre]:
                errors.append(f"Edge asymmetry: {cid} lists {pre} as prerequisite, but {pre} does not list {cid} as successor")
        for succ in succ_graph_zh[cid]:
            if cid not in prereq_graph_zh[succ]:
                errors.append(f"Edge asymmetry: {cid} lists {succ} as successor, but {succ} does not list {cid} as prerequisite")

    # DAG Cycle Detection and Topological Sort (Kahn's algorithm)
    in_degree = {n: len(prereq_graph_zh[n]) for n in all_call_numbers}
    queue = deque([n for n in all_call_numbers if in_degree[n] == 0])
    topo_order = []
    
    while queue:
        curr = queue.popleft()
        topo_order.append(curr)
        for neighbor in sorted(succ_graph_zh[curr]):
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
                
    if len(topo_order) != len(all_call_numbers):
        # Cycle detected!
        cycle_nodes = [n for n in all_call_numbers if in_degree[n] > 0]
        errors.append(f"DAG Cycle detected involving nodes: {cycle_nodes}")
    else:
        print(f"DAG Topological Sort verified! ({len(topo_order)} volumes ordered)")

    # 4. Invariant Accounting
    zh_invs_by_doc = {}
    en_invs_by_doc = {}
    all_zh_inv_ids = set()
    all_en_inv_ids = set()
    inv_definition_counts = defaultdict(int)

    for cid, d in zh_docs.items():
        found = re.findall(r'\[(RULE-\d{3}-\d{2})\]', d['body'])
        u_found = sorted(set(found))
        zh_invs_by_doc[cid] = u_found
        for inv in u_found:
            all_zh_inv_ids.add(inv)
            inv_definition_counts[inv] += 1
            if not inv.startswith(f"RULE-{cid.split('-')[1]}-"):
                errors.append(f"[ZH {cid}] Invariant ID '{inv}' prefix does not match volume call number '{cid}'")
                
        decl_count = d['fm'].get('invariants_count')
        if decl_count is None:
            errors.append(f"[ZH {cid}] Missing invariants_count in frontmatter")
        elif decl_count != len(u_found):
            errors.append(f"[ZH {cid}] invariants_count mismatch: declared {decl_count}, defined {len(u_found)} ({u_found})")

    for cid, d in en_docs.items():
        # Match [RULE-xxx-yy] or `[RULE-xxx-yy]`
        found = re.findall(r'\[(RULE-\d{3}-\d{2})\]', d['body'])
        u_found = sorted(set(found))
        en_invs_by_doc[cid] = u_found
        for inv in u_found:
            all_en_inv_ids.add(inv)
            if not inv.startswith(f"RULE-{cid.split('-')[1]}-"):
                errors.append(f"[EN {cid}] Invariant ID '{inv}' prefix does not match volume call number '{cid}'")
                
        decl_count = d['fm'].get('invariants_count')
        if decl_count is None:
            errors.append(f"[EN {cid}] Missing invariants_count in frontmatter")
        elif decl_count != len(u_found):
            errors.append(f"[EN {cid}] invariants_count mismatch: declared {decl_count}, defined {len(u_found)} ({u_found})")

    for inv, count in inv_definition_counts.items():
        if count > 1:
            errors.append(f"Duplicate invariant ID defined across multiple documents: {inv} (defined {count} times)")

    if all_zh_inv_ids != all_en_inv_ids:
        diff_zh = all_zh_inv_ids - all_en_inv_ids
        diff_en = all_en_inv_ids - all_zh_inv_ids
        if diff_zh:
            errors.append(f"Invariants in ZH but missing in EN: {sorted(diff_zh)}")
        if diff_en:
            errors.append(f"Invariants in EN but missing in ZH: {sorted(diff_en)}")

    total_invariants = len(all_zh_inv_ids)
    print(f"Total Unique Invariants verified: {total_invariants}")

    # 5. Broken Link Validation (Wikilinks & Markdown Links)
    all_md_files = [p.resolve() for p in ROOT.glob('**/*.md') if '_archive_legacy' not in str(p)]
    file_basenames = {p.stem: p for p in all_md_files}

    broken_links = 0
    for p in all_md_files:
        content = p.read_text(encoding='utf-8')
        # Wikilinks [[target]]
        wlinks = re.findall(r'\[\[([^\]|]+)(?:\|[^\]]+)?\]\]', content)
        for target in wlinks:
            target_clean = target.strip()
            if target_clean not in file_basenames and Path(target_clean).stem not in file_basenames:
                errors.append(f"Broken Wikilink in {p.relative_to(ROOT)}: [[{target_clean}]]")
                broken_links += 1

        # Markdown links (strip code & display math)
        content_no_code = re.sub(r'```.*?```', '', content, flags=re.DOTALL)
        content_no_math = re.sub(r'\$\$.*?\$\$', '', content_no_code, flags=re.DOTALL)
        md_links = re.findall(r'(?<!!)\[([^\]]+)\]\(([^)]+)\)', content_no_math)
        for text, target in md_links:
            if target.startswith('http://') or target.startswith('https://') or target.startswith('#') or target.startswith('mailto:'):
                continue
            target_path = urllib.parse.unquote(target.split('#')[0])
            if not target_path:
                continue
            resolved = (p.parent / target_path).resolve()
            if not resolved.exists():
                errors.append(f"Broken relative link in {p.relative_to(ROOT)}: [{text}]({target})")
                broken_links += 1

    # 6. Check README badges against actual invariant count
    readme_zh = (ROOT / 'README.md').read_text(encoding='utf-8')
    readme_en = (ROOT / 'en' / 'README.md').read_text(encoding='utf-8')
    
    badge_pattern = r'System_Rules-(\d+)_Invariants'
    m_zh = re.search(badge_pattern, readme_zh)
    m_en = re.search(badge_pattern, readme_en)
    
    if m_zh and int(m_zh.group(1)) != total_invariants:
        errors.append(f"README.md badge claims {m_zh.group(1)} invariants, but actual count is {total_invariants}")
    if m_en and int(m_en.group(1)) != total_invariants:
        errors.append(f"en/README.md badge claims {m_en.group(1)} invariants, but actual count is {total_invariants}")

    # Output report
    rep_dir = ROOT / 'reports'
    rep_dir.mkdir(exist_ok=True)
    report_data = {
        'status': 'PASS' if not errors else 'FAIL',
        'volume_count': len(all_call_numbers),
        'topological_order': topo_order,
        'invariants_total': total_invariants,
        'error_count': len(errors),
        'errors': errors,
        'warning_count': len(warnings),
        'warnings': warnings
    }
    
    with open(rep_dir / 'library_integrity.json', 'w', encoding='utf-8') as f:
        json.dump(report_data, f, indent=2, ensure_ascii=False)

    print("\n--- Validation Results ---")
    if errors:
        print(f"FAILED with {len(errors)} error(s):")
        for e in errors:
            print(f"  ❌ {e}")
        return 1
    else:
        print("✅ ALL INTEGRITY INVARIANTS PASSED!")
        print(f"  Volumes: {len(all_call_numbers)} (Bilingual pair = {len(all_call_numbers)*2})")
        print(f"  Invariants: {total_invariants} (100% matched, 0 duplicate)")
        print(f"  DAG Status: Strict Directed Acyclic Graph (0 cycles, 0 asymmetries)")
        print(f"  Links: 0 broken Wikilinks, 0 broken relative links")
        return 0

if __name__ == '__main__':
    sys.exit(validate_all())
