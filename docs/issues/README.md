# GitHub Issues Manifest

This folder contains one markdown file per GitHub issue for **custardsquare.exe**.

## Guiding principle

Solo-admin site. **Content first → desktop second → magic third.** Ship the simplest version that works.

## Usage

```bash
node scripts/github-issues.mjs --docs   # regenerate docs/issues/*.md
node scripts/github-issues.mjs --sync   # push open issue text to GitHub
node scripts/github-issues.mjs --create # create missing GitHub issues
```

Each file is named `NNN-slug.md` and includes YAML frontmatter with title, labels, and milestone.

## Issue count

- **MVP issues:** 001–049 + 058–064 (53)
- **V2 issues:** 050–057+ (11)
