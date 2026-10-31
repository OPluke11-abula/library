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

  7. Illegal C0 control characters and forbidden legacy status tokens.

  8. Rule contract level presence and ZH/EN contract level parity across all 103 rules.

  9. Inline body topological navigation vs. YAML frontmatter DAG parity.

  10. Canonical 10-tag Evidence Taxonomy enforcement (no compound slash tags or non-canonical tags).

  11. Python code block AST syntax verification and ZH/EN code block parity.



Returns exit code 0 on complete pass, 1 on failure.

"""



import sys

import os

import re

import ast

import json, hashlib, subprocess

import textwrap

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



CANONICAL_EVIDENCE_TAGS = {

    'FACT',

    'DERIVATION',

    'LITERATURE_RESULT',

    'EMPIRICAL_RESULT',

    'HEURISTIC',

    'DESIGN_DECISION',

    'TARGET',

    'SAFETY_BOUND',

    'HYPOTHESIS',

    'OPEN_QUESTION'

}



CANONICAL_CONTRACT_LEVELS = {

    'CRITICAL_INVARIANT',

    'HIGH_INVARIANT',

    'SAFETY_CRITICAL',

    'STABILITY_CRITICAL',

    'PERFORMANCE_CRITICAL',

    'BOUNDARY_GUARD',

    'RESOURCE_CONSTRAINT',

    'OPTIMIZATION_HEURISTIC',

    'QUALITY_BOUND',

    'STRATEGIC_DIRECTIVE',

    'SECURITY_CRITICAL'

}



def extract_rules_with_levels(body: str):

    rules = {}

    pattern = re.compile(r'###\s+`?\[(RULE-\d{3}-\d{2})\]`?([^\n]*)\n(.*?)(?=\n###\s+|\n##\s+|\n---|\Z)', re.DOTALL)

    for m in pattern.finditer(body):

        rid = m.group(1)

        title = m.group(2).strip()

        content = m.group(3).strip()

        level_m = re.search(r'(?:等級|合約等級|分類|Contract Level|Classification)\*\*:\s*`([A-Z_]+)`', content)

        if not level_m:

            level_m = re.search(r'`([A-Z_]+)`', content)

        level = level_m.group(1) if level_m else None

        rules[rid] = {'title': title, 'level': level, 'content': content}

    return rules



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

    zh_files_multi = defaultdict(list)

    en_files_multi = defaultdict(list)

    

    for p in ROOT.rglob('*.md'):

        rel = p.relative_to(ROOT)

        rel_str = str(rel).replace('\\', '/')

        if '_archive_legacy' in rel_str or '.obsidian' in rel_str:

            continue

        m = re.search(r'(LIB-\d{3})', p.name)

        if m:

            call_no = m.group(1)

            if rel_str.startswith('en/'):

                en_files_multi[call_no].append(rel)

            else:

                zh_files_multi[call_no].append(rel)

                

    return zh_files_multi, en_files_multi



def validate_all():

    errors = []

    warnings = []

    

    zh_files_multi, en_files_multi = find_library_files()

    

    # Check duplicate LIB call numbers per language

    zh_files = {}

    for cid, files in zh_files_multi.items():

        if len(files) > 1:

            errors.append(f"Duplicate call number '{cid}' found in Chinese edition: {[str(f) for f in files]}")

        zh_files[cid] = files[0]

        

    en_files = {}

    for cid, files in en_files_multi.items():

        if len(files) > 1:

            errors.append(f"Duplicate call number '{cid}' found in English edition: {[str(f) for f in files]}")

        en_files[cid] = files[0]

        

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

            elif status == 'Verified-Authoritative-Production':

                errors.append(f"[{lang} {cid}] Forbidden legacy status 'Verified-Authoritative-Production' found in frontmatter")

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

        if len(found) != len(set(found)):

            dups = [r for r in found if found.count(r) > 1]

            errors.append(f"[ZH {cid}] Duplicate RULE IDs within same file: {sorted(set(dups))}")

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

        if len(found) != len(set(found)):

            dups = [r for r in found if found.count(r) > 1]

            errors.append(f"[EN {cid}] Duplicate RULE IDs within same file: {sorted(set(dups))}")

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



    # 7. Check for illegal C0 control characters and forbidden legacy tokens in active Markdown files

    for p in all_md_files:

        raw_bytes = p.read_bytes()

        bad_chars = [(i, b) for i, b in enumerate(raw_bytes) if b < 32 and b not in (10, 13)]

        if bad_chars:

            errors.append(f"Illegal C0 control characters in {p.relative_to(ROOT)}: {len(bad_chars)} occurrences (byte codes: {sorted(set(b for _, b in bad_chars))})")

        if b'Verified-Authoritative-Production' in raw_bytes:

            errors.append(f"Forbidden legacy status 'Verified-Authoritative-Production' found in {p.relative_to(ROOT)}")



    # 8. Rule Contract Level Presence & Bilingual Parity

    for cid in all_call_numbers:

        if cid not in zh_docs or cid not in en_docs:

            continue

        zr = extract_rules_with_levels(zh_docs[cid]['body'])

        er = extract_rules_with_levels(en_docs[cid]['body'])

        for rid in sorted(set(zr.keys()) | set(er.keys())):

            zl = zr.get(rid, {}).get('level')

            el = er.get(rid, {}).get('level')

            if not zl or zl not in CANONICAL_CONTRACT_LEVELS:

                errors.append(f"[ZH {cid}] {rid} missing or invalid contract level: '{zl}'")

            if not el or el not in CANONICAL_CONTRACT_LEVELS:

                errors.append(f"[EN {cid}] {rid} missing or invalid contract level: '{el}'")

            if zl and el and zl != el:

                errors.append(f"[Parity {cid}] {rid} contract level mismatch: ZH='{zl}' vs EN='{el}'")



    # 9. Inline Body Navigation vs YAML Frontmatter DAG (Mandatory for all LIB-001..906)

    for cid in all_call_numbers:

        if cid in zh_docs:

            zfm = zh_docs[cid]['fm']

            zbody = zh_docs[cid]['body']

            fm_pre = set(re.search(r'(LIB-\d{3})', x).group(1) for x in (zfm.get('prerequisites') or []) if re.search(r'(LIB-\d{3})', x))

            fm_suc = set(re.search(r'(LIB-\d{3})', x).group(1) for x in (zfm.get('successors') or []) if re.search(r'(LIB-\d{3})', x))

            head_lines = "\n".join(zbody.splitlines()[:28])

            pre_m = re.search(r'前置依賴\*\*：([^\n]+)', head_lines)

            suc_m = re.search(r'(?:後續節點|後續模組)\*\*：([^\n]+)', head_lines)

            if cid != 'LIB-000':

                if not pre_m:

                    errors.append(f"[ZH {cid}] Missing mandatory inline '前置依賴' navigation header")

                if not suc_m:

                    errors.append(f"[ZH {cid}] Missing mandatory inline '後續節點' navigation header")

            if pre_m:

                body_pre = set(re.findall(r'LIB-\d{3}', pre_m.group(1)))

                if body_pre != fm_pre:

                    errors.append(f"[ZH {cid}] Body '前置依賴' {sorted(body_pre)} != YAML prerequisites {sorted(fm_pre)}")

            if suc_m:

                body_suc = set(re.findall(r'LIB-\d{3}', suc_m.group(1)))

                if body_suc != fm_suc:

                    errors.append(f"[ZH {cid}] Body '後續節點' {sorted(body_suc)} != YAML successors {sorted(fm_suc)}")



        if cid in en_docs:

            efm = en_docs[cid]['fm']

            ebody = en_docs[cid]['body']

            efm_pre = set(re.search(r'(LIB-\d{3})', x).group(1) for x in (efm.get('prerequisites') or []) if re.search(r'(LIB-\d{3})', x))

            efm_suc = set(re.search(r'(LIB-\d{3})', x).group(1) for x in (efm.get('successors') or []) if re.search(r'(LIB-\d{3})', x))

            ehead_lines = "\n".join(ebody.splitlines()[:28])

            epre_m = re.search(r'Prerequisites\*\*:\s*([^\n]+)', ehead_lines)

            esuc_m = re.search(r'Successors\*\*:\s*([^\n]+)', ehead_lines)

            if cid != 'LIB-000':

                if not epre_m:

                    errors.append(f"[EN {cid}] Missing mandatory inline 'Prerequisites' navigation header")

                if not esuc_m:

                    errors.append(f"[EN {cid}] Missing mandatory inline 'Successors' navigation header")

            if epre_m:

                ebody_pre = set(re.findall(r'LIB-\d{3}', epre_m.group(1)))

                if ebody_pre != efm_pre:

                    errors.append(f"[EN {cid}] Body 'Prerequisites' {sorted(ebody_pre)} != YAML prerequisites {sorted(efm_pre)}")

            if esuc_m:

                ebody_suc = set(re.findall(r'LIB-\d{3}', esuc_m.group(1)))

                if ebody_suc != efm_suc:

                    errors.append(f"[EN {cid}] Body 'Successors' {sorted(ebody_suc)} != YAML successors {sorted(efm_suc)}")



    # 10. Canonical Evidence Taxonomy Enforcement & Coverage

    for lang, docs in [('ZH', zh_docs), ('EN', en_docs)]:

        for cid, d in docs.items():

            body_nc = re.sub(r'```.*?```', '', d['body'], flags=re.DOTALL)

            body_nc = re.sub(r'\$\$.*?\$\$', '', body_nc, flags=re.DOTALL)

            body_nc = re.sub(r'\$[^$\n]+\$', '', body_nc)

            body_nc = re.sub(r'`(?!\[[A-Z][A-Z0-9_ /,-]{2,}\]\`)[^`\n]+`', '', body_nc)

            canonical_found = []

            for match in re.finditer(r'\[([A-Z][A-Z0-9_ /,-]{2,})\](?!\()', body_nc):

                tag = match.group(1).strip()

                if re.match(r'^RULE-\d{3}-\d{2}$', tag):

                    continue

                if tag in ('YES', 'NO', 'TOC'):

                    continue

                if tag not in CANONICAL_EVIDENCE_TAGS:

                    errors.append(f"[{lang} {cid}] Non-canonical or compound evidence tag: [{tag}]")

                else:

                    canonical_found.append(tag)

            if len(canonical_found) == 0:

                errors.append(f"[{lang} {cid}] Missing canonical evidence tags (0 found in body)")



    # 11. Python Code Block AST Syntax, Bilingual Code Parity & References Completeness

    for cid in all_call_numbers:

        if cid not in zh_docs or cid not in en_docs:

            continue

        z_blocks = re.findall(r'```python\n(.*?)```', zh_docs[cid]['body'], flags=re.DOTALL)

        e_blocks = re.findall(r'```python\n(.*?)```', en_docs[cid]['body'], flags=re.DOTALL)

        for idx, b in enumerate(z_blocks):

            try:

                ast.parse(textwrap.dedent(b))

            except SyntaxError as e:

                errors.append(f"[ZH {cid}] Python block #{idx+1} SyntaxError: {e}")

        for idx, b in enumerate(e_blocks):

            try:

                ast.parse(textwrap.dedent(b))

            except SyntaxError as e:

                errors.append(f"[EN {cid}] Python block #{idx+1} SyntaxError: {e}")

        if cid not in ('LIB-000', 'LIB-905', 'LIB-906'):

            if len(z_blocks) > 0 and len(e_blocks) == 0:

                errors.append(f"[EN {cid}] Missing Python implementation block (ZH has {len(z_blocks)}, EN has 0)")

        if not re.search(r'(?:參考文獻|文獻|引證|References|Literature)', zh_docs[cid]['body']):

            errors.append(f"[ZH {cid}] Missing References / Literature section")

        if not re.search(r'(?:References|Literature)', en_docs[cid]['body']):

            errors.append(f"[EN {cid}] Missing References / Literature section")



    # Compute deterministic Corpus SHA-256 and Git Commit SHA for reproducibility provenance

    corpus_hasher = hashlib.sha256()

    for cid in sorted(all_call_numbers):

        for docs_map in (zh_docs, en_docs):

            if cid in docs_map:

                rel_p = docs_map[cid]['path'].relative_to(ROOT).as_posix()

                corpus_hasher.update((rel_p + chr(10)).encode('utf-8'))

                corpus_hasher.update(docs_map[cid]['path'].read_bytes())

    corpus_sha256 = corpus_hasher.hexdigest()

    try:

        git_sha = subprocess.check_output(

            ['git', 'log', '-n', '1', '--pretty=format:%H', '--', ':(glob)**/LIB-*.md'],

            cwd=str(ROOT), stderr=subprocess.DEVNULL, text=True

        ).strip() or subprocess.check_output(

            ['git', 'rev-parse', 'HEAD'], cwd=str(ROOT), stderr=subprocess.DEVNULL, text=True

        ).strip()

    except Exception:

        git_sha = 'UNKNOWN'



    # Output report

    rep_dir = ROOT / 'reports'

    rep_dir.mkdir(exist_ok=True)

    report_data = {

        'status': 'PASS' if not errors else 'FAIL',

        'git_commit_sha': git_sha,

        'corpus_sha256': corpus_sha256,

        'volume_count': len(all_call_numbers),

        'bilingual_file_count': len(zh_docs) + len(en_docs),

        'topological_order': topo_order,

        'invariants_total': total_invariants,

        'checks_enabled': 11,

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

        print("✅ ALL 11 INTEGRITY INVARIANTS PASSED!")

        print(f"  Volumes: {len(all_call_numbers)} (Bilingual pair = {len(all_call_numbers)*2})")

        print(f"  Invariants: {total_invariants} (100% matched, 0 duplicate, 100% contract level parity)")

        print(f"  DAG Status: Strict Directed Acyclic Graph (0 cycles, 0 asymmetries, 100% inline nav parity)")

        print(f"  Taxonomy & AST: 100% canonical evidence tags, 100% valid Python AST & bilingual code parity")

        print(f"  Links: 0 broken Wikilinks, 0 broken relative links")

        return 0



if __name__ == '__main__':

    sys.exit(validate_all())

