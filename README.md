# pismax add-ons for Translator++

Translator++ parsers for console games. Each add-on lives in its own
repository; this one holds the catalog (`tpp-catalog.json`) that lists the
current release of each.

| Add-on | Repository | Version |
|---|---|---|
| Tokimeki Memorial 2 (PlayStation) parser | [pismax/tpp-tm2Psx](https://github.com/pismax/tpp-tm2Psx) | 0.1.49 |
| Tokimeki Memorial 4 (PSP) parser | [pismax/tpp-tm4Psp](https://github.com/pismax/tpp-tm4Psp) | 1.2.6 |
| Princess Maker 4 (PS2) parser | [pismax/tpp-pm4Ps2](https://github.com/pismax/tpp-pm4Ps2) | 0.6.0 |

## Install

**From Translator++:** if your version has **Options → Add-ons → Install →
Community add-ons**, the add-ons appear there. Select **Install**, then restart
Translator++. Updates show up in the same place.

**Manually:** on the add-on's repository, open **Tags**, download the zip of
the version listed above, extract it into `<Translator++>/www/addons/`, and
rename the extracted folder to the add-on's package name (`tm2Psx`, `tm4Psp`
or `pm4Ps2`). Then restart Translator++.

Each add-on's README lists the game version it supports and the Translator++
version it needs. You need your own copy of the game; no game data is included.

Add-ons run with full access to your computer, like any Translator++ add-on.
Report problems in the add-on's repository.

## Developing

See [AGENTS.md](AGENTS.md) for how releases and catalog changes work. It is
written for people and coding agents alike.
