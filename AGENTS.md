# AGENTS.md — pismax Translator++ add-on catalog

This repository lists pismax's Translator++ add-ons. `tpp-catalog.json` uses
the catalog format Translator++ reads for its **Community add-ons** list. The
add-on code lives in each add-on's own repository, never here.

For step-by-step playbooks (new add-on, release, review, delisting, answering
user questions) load the `tpp-community-addons` skill
(`.claude/skills/` for Claude Code, `.agents/skills/` for Codex). Keep the two
copies identical.

## Catalog format

```json
{
  "schema": 1,
  "title": "pismax add-ons",
  "addons": [
    { "repo": "pismax/tpp-example", "ref": "v1.2.0" },
    { "repo": "pismax/tpp-old", "ref": "v0.3.0", "deprecated": "Replaced by tpp-example." }
  ]
}
```

- `repo`: an add-on repository whose root is the add-on folder
  (`package.json` at the root).
- `ref`: the release tag users get. Translator++ installs the commit the tag
  points to, and offers an update when the tag's `package.json` version is
  higher than the installed one.
- `deprecated` (optional): keeps the entry listed with this notice.

## Rules

- List only pismax repositories.
- Pin every entry to a version tag (`vX.Y.Z`) whose `package.json` has that
  version. A branch ref would give users unreviewed code.
- Package `name` is permanent: it is the add-on's folder name and settings key.
  Two entries can never share a name.
- `minimumVersion` must name the oldest Translator++ release that runs the
  version.
- Run `node scripts/validate-catalog.js` before pushing. CI runs it on pull
  requests, pushes to `main` and weekly.
- Never commit game data, ROM/ISO extracts, keys or other copyrighted assets to
  any repository.
- Commits are authored as `pismax <360907843+pismax@users.noreply.github.com>`.
  Do not add other identities, emails or local paths to commits or files.
