# pismax add-ons for Translator++

Community add-ons for Translator++, published by pismax. Each add-on lives in its own repository; this repository
holds the catalog (`tpp-catalog.json`) that Translator++ reads.

| Add-on | Repository | Version |
|---|---|---|
| Tokimeki Memorial 2 (PlayStation) parser | [pismax/tpp-tm2Psx](https://github.com/pismax/tpp-tm2Psx) | 0.1.46 |
| Tokimeki Memorial 4 (PSP) parser | [pismax/tpp-tm4Psp](https://github.com/pismax/tpp-tm4Psp) | 1.2.5 |
| Princess Maker 4 (PS2) parser | [pismax/tpp-pm4Ps2](https://github.com/pismax/tpp-pm4Ps2) | 0.3.0 |

## Install

In Translator++ 8.11.25 or later (Basic Utility 0.35 or later), open
**Options → Add-ons → Install** and scroll to **Community add-ons**. Select
**Install**, then restart Translator++.

Each add-on is installed from the exact commit its catalog tag points to. No
git or GitHub account is needed.

Community add-ons are not reviewed by the Translator++ developers. They run
with the same access to your computer as any other add-on, so install only
what you trust. Report problems in the add-on's own repository.

## For add-on developers and maintainers

See [AGENTS.md](AGENTS.md): repository layout, publishing a version, catalog
changes and the review checklist. It is written for people and coding agents
alike. Catalog changes are validated by `node scripts/validate-catalog.js`
(also run in CI on every pull request).
