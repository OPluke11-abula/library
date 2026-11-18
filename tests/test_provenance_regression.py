#!/usr/bin/env python3
"""Minimal Provenance v2.0 regression suite (shallow-clone safe for CI & local)."""

import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

import library_rag  # noqa: E402


def _ensure_git_on_path() -> str:
    git_exe = shutil.which("git")
    if git_exe:
        return git_exe
    win_git = Path(r"C:\Program Files\Git\cmd\git.exe")
    if win_git.exists():
        os.environ["PATH"] = f"{win_git.parent}{os.pathsep}{os.environ.get('PATH', '')}"
        return str(win_git)
    raise RuntimeError("git executable not found on PATH")


def _compute_disk_corpus_sha256(root: Path) -> str:
    zh_files = {}
    en_files = {}
    for p in root.glob("[0-9][0-9]_*/LIB-*.md"):
        m = re.match(r"(LIB-\d{3})\b", p.name)
        if m:
            zh_files[m.group(1)] = p
    for p in root.glob("en/[0-9][0-9]_*/LIB-*.md"):
        m = re.match(r"(LIB-\d{3})\b", p.name)
        if m:
            en_files[m.group(1)] = p
    hasher = hashlib.sha256()
    for cid in sorted(set(zh_files) | set(en_files)):
        for mapping in (zh_files, en_files):
            if cid in mapping:
                p = mapping[cid]
                hasher.update((p.relative_to(root).as_posix() + "\n").encode("utf-8"))
                hasher.update(p.read_bytes())
    return hasher.hexdigest()


class TestProvenanceRegression(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.git = _ensure_git_on_path()

    def _git(self, repo: Path, *args: str) -> str:
        return subprocess.check_output(
            [self.git, *args], cwd=str(repo), text=True, stderr=subprocess.PIPE
        ).strip()

    def test_clean_dirty_and_head_vs_corpus_separation(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            repo = Path(tmp)
            self._git(repo, "init")
            self._git(repo, "config", "user.name", "Test Auditor")
            self._git(repo, "config", "user.email", "audit@example.com")

            corpus_dir = repo / "00_test"
            corpus_dir.mkdir()
            note = corpus_dir / "LIB-001 Test (Test).md"
            note.write_text("# Test v1\n", encoding="utf-8")
            self._git(repo, "add", ".")
            self._git(repo, "commit", "-m", "commit corpus v1")
            c1 = self._git(repo, "rev-parse", "HEAD")

            prov_clean = library_rag.get_git_provenance(repo)
            self.assertEqual(prov_clean["provenance_version"], "2.0")
            self.assertEqual(prov_clean["generation_mode"], "clean_committed_corpus")
            self.assertFalse(prov_clean["corpus_working_tree_dirty"])
            self.assertEqual(prov_clean["corpus_source_commit_sha"], c1)
            self.assertEqual(prov_clean["repository_head_sha"], c1)
            self.assertEqual(prov_clean["git_commit_sha"], c1)

            # Uncommitted edit to LIB-*.md must flag +dirty rather than masquerading as clean c1
            note.write_text("# Test v2 dirty\n", encoding="utf-8")
            prov_dirty = library_rag.get_git_provenance(repo)
            self.assertEqual(prov_dirty["generation_mode"], "uncommitted_working_tree")
            self.assertTrue(prov_dirty["corpus_working_tree_dirty"])
            self.assertEqual(prov_dirty["corpus_source_commit_sha"], c1)
            self.assertEqual(prov_dirty["git_commit_sha"], f"{c1}+dirty")

            # Revert dirty corpus file and advance HEAD with non-corpus commit c2
            self._git(repo, "checkout", "--", ".")
            (repo / "README.md").write_text("docs update\n", encoding="utf-8")
            self._git(repo, "add", "README.md")
            self._git(repo, "commit", "-m", "non-corpus docs commit")
            c2 = self._git(repo, "rev-parse", "HEAD")
            self.assertNotEqual(c1, c2)

            prov_after = library_rag.get_git_provenance(repo)
            self.assertEqual(prov_after["generation_mode"], "clean_committed_corpus")
            self.assertFalse(prov_after["corpus_working_tree_dirty"])
            self.assertEqual(prov_after["corpus_source_commit_sha"], c1)
            self.assertEqual(prov_after["repository_head_sha"], c2)

    def test_committed_reports_match_disk_corpus_sha256_and_schema(self) -> None:
        disk_sha = _compute_disk_corpus_sha256(ROOT)
        specs = [
            (ROOT / "reports" / "library_integrity.json", None, False),
            (ROOT / "reports" / "library_rag_index.json", "summary", False),
            (ROOT / "reports" / "library_rag_benchmark.json", None, True),
        ]
        for path, nested_key, require_exec_sha in specs:
            payload = json.loads(path.read_text(encoding="utf-8"))
            section = payload[nested_key] if nested_key else payload
            self.assertEqual(section.get("provenance_version"), "2.0", f"{path} missing provenance_version")
            self.assertEqual(section.get("generation_mode"), "clean_committed_corpus", f"{path} not clean")
            self.assertIs(section.get("corpus_working_tree_dirty"), False, f"{path} dirty flag")
            self.assertTrue(re.fullmatch(r"[0-9a-f]{40}", section.get("corpus_source_commit_sha", "")))
            self.assertEqual(section.get("corpus_sha256"), disk_sha, f"{path} corpus_sha256 stale vs disk")
            if require_exec_sha:
                self.assertTrue(re.fullmatch(r"[0-9a-f]{40}", section.get("benchmark_execution_commit_sha", "")))


if __name__ == "__main__":
    unittest.main()
