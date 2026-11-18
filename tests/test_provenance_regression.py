#!/usr/bin/env python3
"""Provenance v2.0 & cross-platform Canonical LF hashing regression suite."""

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
import validate_library  # noqa: E402


def _ensure_git_on_path() -> str:
    git_exe = shutil.which("git")
    if git_exe:
        return git_exe
    for candidate in (
        Path(r"C:\Program Files\Git\cmd\git.exe"),
        Path.home() / "AppData" / "Local" / "Programs" / "Git" / "cmd" / "git.exe",
    ):
        try:
            exists = candidate.exists()
        except OSError:
            exists = False
        if exists:
            os.environ["PATH"] = f"{candidate.parent}{os.pathsep}{os.environ.get('PATH', '')}"
            return str(candidate)
    raise RuntimeError("git executable not found on PATH")


def _canonicalize_corpus_bytes(raw_bytes: bytes) -> bytes:
    """Normalize CRLF line endings to canonical LF bytes without altering source files."""
    return raw_bytes.replace(b"\r\n", b"\n")


def _discover_sorted_corpus_entries(root: Path):
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
    entries = []
    for cid in sorted(set(zh_files) | set(en_files)):
        for mapping in (zh_files, en_files):
            if cid in mapping:
                p = mapping[cid]
                entries.append((p.relative_to(root).as_posix(), p))
    return entries


def _compute_disk_corpus_sha256(root: Path, *, canonical_lf: bool = True) -> str:
    hasher = hashlib.sha256()
    for rel_p, p in _discover_sorted_corpus_entries(root):
        hasher.update((rel_p + "\n").encode("utf-8"))
        raw = p.read_bytes()
        hasher.update(_canonicalize_corpus_bytes(raw) if canonical_lf else raw)
    return hasher.hexdigest()


def _assert_reports_match_corpus(testcase: unittest.TestCase, repo_root: Path, disk_sha: str) -> None:
    specs = [
        (repo_root / "reports" / "library_integrity.json", None, False),
        (repo_root / "reports" / "library_rag_index.json", "summary", False),
        (repo_root / "reports" / "library_rag_benchmark.json", None, True),
    ]
    observed_hashes = []
    for path, nested_key, require_exec_sha in specs:
        payload = json.loads(path.read_text(encoding="utf-8"))
        section = payload[nested_key] if nested_key else payload
        testcase.assertEqual(section.get("provenance_version"), "2.0", f"{path} missing provenance_version")
        testcase.assertEqual(section.get("generation_mode"), "clean_committed_corpus", f"{path} not clean")
        testcase.assertIs(section.get("corpus_working_tree_dirty"), False, f"{path} dirty flag")
        testcase.assertTrue(re.fullmatch(r"[0-9a-f]{40}", section.get("corpus_source_commit_sha", "")))
        report_sha = section.get("corpus_sha256", "")
        testcase.assertEqual(report_sha, disk_sha, f"{path} corpus_sha256 stale vs disk")
        observed_hashes.append(report_sha)
        if require_exec_sha:
            testcase.assertTrue(re.fullmatch(r"[0-9a-f]{40}", section.get("benchmark_execution_commit_sha", "")))
    testcase.assertEqual(len(set(observed_hashes)), 1, "All three reports must share identical corpus_sha256")


def _write_temp_bilingual_pair(repo: Path, zh_body: str, en_body: str, *, line_ending: bytes) -> None:
    zh_dir = repo / "00_test"
    en_dir = repo / "en" / "00_test"
    zh_dir.mkdir(parents=True, exist_ok=True)
    en_dir.mkdir(parents=True, exist_ok=True)
    (zh_dir / "LIB-001 Test Note (Test).md").write_bytes(zh_body.replace("\n", line_ending.decode("ascii")).encode("utf-8"))
    (en_dir / "LIB-001 Test Note (Agent EN).md").write_bytes(en_body.replace("\n", line_ending.decode("ascii")).encode("utf-8"))


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

    def test_canonical_lf_hashing_crlf_equivalence_and_sensitivity(self) -> None:
        zh_v1 = "---\ncall_number: LIB-001\ntitle: \"Test ZH\"\nprerequisites: []\nsuccessors: []\n---\n\n## Section 1\nLine A\nLine B\n"
        en_v1 = "---\ncall_number: LIB-001\ntitle: \"Test EN\"\nprerequisites: []\nsuccessors: []\n---\n\n## Section 1\nLine A\nLine B\n"
        zh_v2 = zh_v1.replace("Line B", "Line B modified")

        with tempfile.TemporaryDirectory() as tmp_lf, tempfile.TemporaryDirectory() as tmp_crlf:
            repo_lf = Path(tmp_lf)
            repo_crlf = Path(tmp_crlf)
            _write_temp_bilingual_pair(repo_lf, zh_v1, en_v1, line_ending=b"\n")
            _write_temp_bilingual_pair(repo_crlf, zh_v1, en_v1, line_ending=b"\r\n")

            # Raw byte hashes must genuinely differ (LF vs CRLF checkout simulation)
            raw_lf_sha = _compute_disk_corpus_sha256(repo_lf, canonical_lf=False)
            raw_crlf_sha = _compute_disk_corpus_sha256(repo_crlf, canonical_lf=False)
            self.assertNotEqual(raw_lf_sha, raw_crlf_sha)

            # Canonical LF hashes must match identically across all three implementations
            test_lf_sha = _compute_disk_corpus_sha256(repo_lf, canonical_lf=True)
            test_crlf_sha = _compute_disk_corpus_sha256(repo_crlf, canonical_lf=True)
            val_lf_sha = validate_library.compute_canonical_corpus_sha256(repo_lf)
            val_crlf_sha = validate_library.compute_canonical_corpus_sha256(repo_crlf)
            rag_lf_sha = library_rag.LibraryGraphRAGEngine(repo_lf).build_index(save_json=False)["corpus_sha256"]
            rag_crlf_sha = library_rag.LibraryGraphRAGEngine(repo_crlf).build_index(save_json=False)["corpus_sha256"]

            self.assertEqual({test_lf_sha, test_crlf_sha, val_lf_sha, val_crlf_sha, rag_lf_sha, rag_crlf_sha}, {raw_lf_sha})

            # Substantive Markdown change must change the Canonical LF hash everywhere
            _write_temp_bilingual_pair(repo_crlf, zh_v2, en_v1, line_ending=b"\r\n")
            mutated_test_sha = _compute_disk_corpus_sha256(repo_crlf, canonical_lf=True)
            mutated_val_sha = validate_library.compute_canonical_corpus_sha256(repo_crlf)
            mutated_rag_sha = library_rag.LibraryGraphRAGEngine(repo_crlf).build_index(save_json=False)["corpus_sha256"]
            self.assertEqual({mutated_test_sha, mutated_val_sha, mutated_rag_sha}, {mutated_test_sha})
            self.assertNotEqual(mutated_test_sha, test_lf_sha)

    def test_live_corpus_hashes_match_across_validators(self) -> None:
        disk_sha = _compute_disk_corpus_sha256(ROOT, canonical_lf=True)
        val_sha = validate_library.compute_canonical_corpus_sha256(ROOT)
        rag_sha = library_rag.LibraryGraphRAGEngine(ROOT).build_index(save_json=False)["corpus_sha256"]
        self.assertEqual(val_sha, disk_sha)
        self.assertEqual(rag_sha, disk_sha)

    def test_committed_reports_match_disk_corpus_sha256_and_schema(self) -> None:
        disk_sha = _compute_disk_corpus_sha256(ROOT, canonical_lf=True)
        _assert_reports_match_corpus(self, ROOT, disk_sha)

    def test_stale_reports_rejected_even_under_canonical_lf(self) -> None:
        fresh_sha = "a" * 64
        stale_sha = "b" * 64
        commit_sha = "c" * 40
        base_prov = {
            "provenance_version": "2.0",
            "generation_mode": "clean_committed_corpus",
            "corpus_working_tree_dirty": False,
            "corpus_source_commit_sha": commit_sha,
            "corpus_sha256": fresh_sha,
        }
        for stale_target in ("library_integrity.json", "library_rag_index.json", "library_rag_benchmark.json"):
            with tempfile.TemporaryDirectory() as tmp:
                rep_dir = Path(tmp) / "reports"
                rep_dir.mkdir()
                integrity = dict(base_prov)
                rag_index = {"summary": dict(base_prov)}
                rag_bench = {**base_prov, "benchmark_execution_commit_sha": commit_sha}
                if stale_target == "library_integrity.json":
                    integrity["corpus_sha256"] = stale_sha
                elif stale_target == "library_rag_index.json":
                    rag_index["summary"]["corpus_sha256"] = stale_sha
                else:
                    rag_bench["corpus_sha256"] = stale_sha
                (rep_dir / "library_integrity.json").write_text(json.dumps(integrity), encoding="utf-8")
                (rep_dir / "library_rag_index.json").write_text(json.dumps(rag_index), encoding="utf-8")
                (rep_dir / "library_rag_benchmark.json").write_text(json.dumps(rag_bench), encoding="utf-8")
                with self.assertRaises(AssertionError, msg=f"Stale {stale_target} must fail validation"):
                    _assert_reports_match_corpus(self, Path(tmp), fresh_sha)

    def test_shallow_clone_and_missing_git_never_masquerade_head(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            base = Path(tmp)
            src_repo = base / "src"
            shallow_repo = base / "shallow"
            src_repo.mkdir()
            self._git(src_repo, "init")
            self._git(src_repo, "config", "user.name", "Test Auditor")
            self._git(src_repo, "config", "user.email", "audit@example.com")

            corpus_dir = src_repo / "00_test"
            corpus_dir.mkdir()
            (corpus_dir / "LIB-001 Test (Test).md").write_text("# Corpus v1\n", encoding="utf-8")
            self._git(src_repo, "add", ".")
            self._git(src_repo, "commit", "-m", "commit corpus c1")
            c1 = self._git(src_repo, "rev-parse", "HEAD")

            # Advance with a non-corpus commit c2
            (src_repo / "README.md").write_text("docs update\n", encoding="utf-8")
            self._git(src_repo, "add", "README.md")
            self._git(src_repo, "commit", "-m", "non-corpus docs c2")
            c2 = self._git(src_repo, "rev-parse", "HEAD")
            self.assertNotEqual(c1, c2)

            # Depth-1 shallow clone stops at c2; neither engine may report c2 as corpus_source_commit_sha
            subprocess.check_call(
                [self.git, "clone", "--depth", "1", src_repo.as_uri(), str(shallow_repo)],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
            for prov in (
                library_rag.get_git_provenance(shallow_repo),
                validate_library.get_git_provenance(shallow_repo),
            ):
                self.assertEqual(prov["repository_head_sha"], c2)
                self.assertEqual(prov["corpus_source_commit_sha"], "UNKNOWN")
                self.assertEqual(prov["git_commit_sha"], "UNKNOWN")
                self.assertEqual(prov["generation_mode"], "unverified_shallow_or_missing_git_history")
                self.assertNotEqual(prov["corpus_source_commit_sha"], c2)

            # Simulated git-unavailable repo with .git/HEAD must not substitute HEAD as corpus_source_commit_sha
            no_git = base / "no_git"
            (no_git / ".git").mkdir(parents=True)
            (no_git / ".git" / "HEAD").write_text(f"{c2}\n", encoding="utf-8")
            for prov in (
                library_rag.get_git_provenance(no_git),
                validate_library.get_git_provenance(no_git),
            ):
                self.assertEqual(prov["repository_head_sha"], c2)
                self.assertEqual(prov["corpus_source_commit_sha"], "UNKNOWN")
                self.assertEqual(prov["git_commit_sha"], "UNKNOWN")

        wf_text = (ROOT / ".github" / "workflows" / "validate.yml").read_text(encoding="utf-8")
        self.assertIn("fetch-depth: 0", wf_text)
        self.assertLess(
            wf_text.index("tests/test_provenance_regression.py"),
            wf_text.index("scripts/validate_library.py"),
        )


if __name__ == "__main__":
    unittest.main()
