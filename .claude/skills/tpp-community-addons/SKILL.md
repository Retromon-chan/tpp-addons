---
name: tpp-community-addons
description: Create, release, review, deprecate or remove Translator++ community add-ons listed in the pismax catalog, and answer questions about them. Use for changes to tpp-catalog.json, publishing a new add-on version, reviewing a catalog pull request, or explaining what an add-on does and how to install, update or uninstall it.
---

# Translator++ community add-ons

Identify who you are helping, then follow that playbook. Read AGENTS.md first
for the catalog rules.

## Answering a user's question about an add-on

- In a session connected to Translator++ over MCP: `addons.community.list`
  (what is offered, installed version, `updateAvailable`, `blockedReason`) and
  `addons.community.info {addon}` (README excerpt, repository, pinned commit).
- Otherwise read `tpp-catalog.json` here and the add-on repository's README at
  the catalog tag.
- Install, update and uninstall are the user's decision. Over MCP,
  `addons.community.install` needs `acknowledgeUnverified: true` only after the
  user agreed to run unverified code. Every change needs a Translator++ restart.
- `blockedReason` "already installed ... not installed from a community
  source" means the user has another copy (official store or manual). They must
  uninstall that copy in the add-on manager first; the community installer never
  replaces it.
- Bugs go to the add-on repository's issues, not this catalog.

## Creating a new add-on repository

1. Repository `pismax/tpp-<name>`; its root is the add-on folder.
2. `package.json` at the root: `name` (folder name, permanent, matches
   `^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$`), `title`, `description`, `version`
   (dotted numbers), `main`/`load`, `minimumVersion`, optional `icon`,
   `author: {"name": "pismax"}`, `homepage` = the repository URL.
3. Ship plain JavaScript that runs as checked in; there is no install-time build.
4. Develop by cloning into `<Translator++>/www/addons/<name>` so `www/js/...`
   requires resolve. Run the add-on's tests from the Translator++ root.
5. No game data, ROM/ISO extracts, emulator files or copyrighted artwork.
6. Commit as `pismax <360907843+pismax@users.noreply.github.com>`.
7. Tag the first release `v<version>` and add a catalog entry (see "Release").

## Releasing a version

1. In the add-on repository: bump `package.json` `version` (and any
   `package-lock.json` top-level/root-package version), update
   `minimumVersion` if the release needs a newer Translator++, commit.
2. Tag `v<version>` on that commit and push the tag:
   `git tag v1.2.6 && git push origin main v1.2.6`.
3. In this catalog: change the entry's `ref` to the new tag, run
   `node scripts/validate-catalog.js`, update the README table, and open a pull
   request (or push to `main` when you maintain the catalog alone).
4. Users see **Update** after the catalog change reaches `main` (Translator++
   caches listings for about five minutes).

Never move or delete a published tag; publish a new version instead.

## Reviewing a catalog change

For a new or changed `ref`, compare the code users will receive:
`gh api repos/pismax/<repo>/compare/<old-tag>...<new-tag>` (or read the whole
tree for a new add-on). Reject or ask for changes when you find:

- `eval`, `new Function`, `vm` or dynamically built `require` paths on remote data;
- `child_process` or native executables that are not explained in the README;
- network access to undocumented hosts, telemetry, or uploads of user files;
- writes outside the add-on folder, the user's chosen output folder, or the
  Translator++ staging/temp folders;
- obfuscated or minified source, committed binaries without source, or bundled
  game/copyrighted data;
- a changed `name`, a version that does not increase, a tag whose
  `package.json` version differs, or a missing `minimumVersion` bump when the
  code uses newer Translator++ APIs.

CI must pass. Record notable review findings in the pull request.

## Deprecating or removing an add-on

- Deprecate: keep the entry and add `"deprecated": "<reason and replacement>"`.
  Users still see it, with the notice.
- Remove: delete the entry. Installed copies keep working and can still be
  uninstalled in Translator++; they simply stop receiving updates.
- Security problem: remove the entry immediately, then open an issue in the
  add-on repository describing the affected versions and asking users to
  uninstall. Fix forward with a new version and tag.
- Archive a repository on GitHub only after removing its catalog entry.

## Catalog policy

Translator++ reads this catalog with `links: sameOwner`, so entries outside
`pismax/*` are ignored. Listing a third-party repository needs a change to the
source list in Translator++'s Basic Utility (a `links: any` source or a separate
source entry), which is outside this repository.
