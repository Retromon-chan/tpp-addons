# AGENTS.md — pismax Translator++ add-on catalog

This repository is a **catalog**: `tpp-catalog.json` lists add-on repositories
that Translator++ offers under **Options → Add-ons → Install → Community
add-ons**. Add-on code lives in each add-on's own repository, never here.

For step-by-step playbooks (new add-on, release, review, delisting, answering
user questions) load the `tpp-community-addons` skill
(`.claude/skills/` for Claude Code, `.agents/skills/` for Codex). Keep the two
copies identical.

## How Translator++ reads this catalog

- Translator++'s Basic Utility lists `pismax/tpp-addons` (ref `main`) with the
  link policy **sameOwner**: only `pismax/*` entries are shown; others are
  skipped with a reason.
- Catalog entries: `{ "repo": "pismax/<repo>", "ref": "<tag>", "deprecated"?: "<notice>" }`.
  Catalogs are followed one level; an entry must be an add-on repository.
- Install resolves `ref` to a commit, downloads that commit's zip from GitHub,
  checks `package.json`, and copies the repository root to
  `www/addons/<package.json name>` with a `.tpp-source.json` record. `.git`
  and `.github` are not installed. Nothing is built or executed at install time.
- An installed add-on updates when the catalog ref points at a higher
  `package.json` version. It is never installed over an add-on that the user got
  elsewhere (folder without `.tpp-source.json`).

## Rules

- Pin every entry to a version tag (`vX.Y.Z`) whose `package.json` has that
  version. A branch ref lets users receive unreviewed code.
- Package `name` is permanent: it is the install folder and the settings key.
  Two entries can never share a name.
- `minimumVersion` must name the oldest Translator++ release that runs the
  version, or users on older apps get a broken add-on.
- Run `node scripts/validate-catalog.js` before pushing. CI runs it on pull
  requests, pushes to `main` and weekly.
- Never commit game data, ROM/ISO extracts, keys or other copyrighted assets to
  any repository.
- Commits are authored as `pismax <360907843+pismax@users.noreply.github.com>`.
  Do not add other identities, emails or local paths to commits or files.
