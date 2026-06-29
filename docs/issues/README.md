# GitHub Issues Manifest

This folder contains one markdown file per GitHub issue for **custardsquare.exe**.

## Usage

Generate/update docs and create GitHub issues:

```bash
node scripts/github-issues.mjs --docs
node scripts/github-issues.mjs --create
```

Each file is named `NNN-slug.md` and includes YAML frontmatter with title, labels, and milestone.

## Issue count

- **MVP issues:** 001–049 (49)
- **V2 issues:** 050–057 (8)
