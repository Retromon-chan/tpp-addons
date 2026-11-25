#!/usr/bin/env node
'use strict';
/*
 * Validate tpp-catalog.json the way Translator++ reads it.
 *
 *   node scripts/validate-catalog.js            # checks every entry on GitHub
 *   node scripts/validate-catalog.js --offline  # format checks only
 *
 * GITHUB_TOKEN (optional) raises the GitHub API rate limit.
 * Exit code 1 when any error is found.
 */
const fs = require('fs');
const path = require('path');

const CATALOG = path.join(__dirname, '..', 'tpp-catalog.json');
const NAME = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;
const SEGMENT = /^[A-Za-z0-9_.-]+$/;
const REF = /^[A-Za-z0-9._\/-]{1,200}$/;
const VERSION = /^\d+(\.\d+)*$/;
const offline = process.argv.includes('--offline');
const owner = (process.env.CATALOG_OWNER || 'pismax').toLowerCase();

const errors = [];
const warnings = [];
const fail = message => errors.push(message);
const warn = message => warnings.push(message);

async function get(url, accept) {
    const headers = {'User-Agent': 'tpp-catalog-validator'};
    if (accept) headers.Accept = accept;
    if (process.env.GITHUB_TOKEN && url.startsWith('https://api.github.com/')) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const res = await fetch(url, {headers});
    return {status: res.status, text: await res.text()};
}

function parseRepo(value) {
    const parts = String(value || '').replace(/^github:/i, '').split('/');
    if (parts.length !== 2 || !parts.every(part => SEGMENT.test(part) && part !== '.' && part !== '..')) return null;
    return {owner: parts[0], repo: parts[1]};
}

async function checkEntry(entry, index, names) {
    const label = `addons[${index}]`;
    const repo = parseRepo(entry.repo);
    if (!repo) return fail(`${label}: "repo" must be owner/repo, got ${JSON.stringify(entry.repo)}`);
    const id = `${repo.owner}/${repo.repo}`;
    if (repo.owner.toLowerCase() !== owner) fail(`${id}: Translator++ lists this catalog with links "sameOwner"; only ${owner}/* repositories are shown.`);
    const ref = entry.ref;
    if (!ref) warn(`${id}: no "ref"; users get the default branch "main". Pin a tag.`);
    else if (!REF.test(ref) || ref.includes('..')) fail(`${id}: invalid ref ${JSON.stringify(ref)}`);
    else if (!/^v\d/.test(ref) && !/^[0-9a-f]{40}$/.test(ref)) warn(`${id}: ref "${ref}" is not a version tag or commit; the listed version can change without a catalog review.`);
    const extra = Object.keys(entry).filter(key => !['repo', 'ref', 'deprecated'].includes(key));
    if (extra.length) warn(`${id}: unknown keys ${extra.join(', ')}`);
    if (offline) return;

    const at = ref || 'main';
    const sha = await get(`https://api.github.com/repos/${id}/commits/${encodeURIComponent(at)}`, 'application/vnd.github.sha');
    if (sha.status !== 200) return fail(`${id}: ref "${at}" does not resolve (HTTP ${sha.status}).`);
    const pkgRes = await get(`https://raw.githubusercontent.com/${id}/${sha.text.trim()}/package.json`);
    if (pkgRes.status !== 200) return fail(`${id}@${at}: no package.json at the repository root.`);
    let pkg;
    try { pkg = JSON.parse(pkgRes.text); } catch (error) { return fail(`${id}@${at}: package.json is not valid JSON (${error.message}).`); }
    if (!NAME.test(String(pkg.name || ''))) fail(`${id}@${at}: package.json name ${JSON.stringify(pkg.name)} is not a valid add-on folder name.`);
    else if (names.has(pkg.name)) fail(`${id}: package name "${pkg.name}" is already used by ${names.get(pkg.name)}.`);
    else names.set(pkg.name, id);
    if (!VERSION.test(String(pkg.version || ''))) fail(`${id}@${at}: package.json version ${JSON.stringify(pkg.version)} must be dotted numbers.`);
    if (pkg.minimumVersion && !VERSION.test(String(pkg.minimumVersion))) fail(`${id}@${at}: minimumVersion ${JSON.stringify(pkg.minimumVersion)} must be dotted numbers.`);
    if (!pkg.title) warn(`${id}@${at}: package.json has no title.`);
    if (!pkg.description) warn(`${id}@${at}: package.json has no description.`);
    if (ref && /^v\d/.test(ref) && pkg.version && ref !== `v${pkg.version}`) warn(`${id}: tag ${ref} holds version ${pkg.version}.`);
    console.log(`ok  ${id}@${at} -> ${pkg.name} ${pkg.version}`);
}

async function main() {
    let catalog;
    try { catalog = JSON.parse(fs.readFileSync(CATALOG, 'utf8')); }
    catch (error) { fail(`tpp-catalog.json: ${error.message}`); }
    if (catalog) {
        if (catalog.schema !== 1) fail('tpp-catalog.json: "schema" must be 1.');
        if (!Array.isArray(catalog.addons)) fail('tpp-catalog.json: "addons" must be an array.');
        const seen = new Set();
        const names = new Map();
        for (const [index, raw] of (catalog.addons || []).entries()) {
            const entry = typeof raw === 'string' ? {repo: raw} : raw;
            const key = String(entry?.repo || '').toLowerCase();
            if (seen.has(key)) { fail(`addons[${index}]: ${entry.repo} is listed twice.`); continue; }
            seen.add(key);
            await checkEntry(entry || {}, index, names);
        }
    }
    for (const message of warnings) console.log(`warn ${message}`);
    for (const message of errors) console.error(`FAIL ${message}`);
    console.log(`${errors.length} error(s), ${warnings.length} warning(s)`);
    process.exit(errors.length ? 1 : 0);
}

main().catch(error => { console.error(error); process.exit(1); });
