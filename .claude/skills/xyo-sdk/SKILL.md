---
name: xyo-sdk
description: >-
  How to use xyo-sdk, the control repository that runs fabricare over all the
  XYO C++ repositories in dependency order: fabricare git-clone (clone / pull
  every project next to xyo-sdk, XYO_SDK_SOURCE_GIT), the workspace mode
  fabricare --sdk [action] (make + install, clean, test, version, ... in every
  project), the flags --no-vendor / --only-vendor / --static, platform /
  platform.windows / platform.ubuntu (build or install-from-release for
  win64-msvc-2026, win64-msvc-2026.static, wsl-ubuntu-24.04, wsl-ubuntu-26.04),
  platform-install-from-release, has-no-release (--for-platform),
  dependency-version (--commit, --use-no-release), release (SDK release
  manifest release/xyo-sdk-<version>.json), release-remove-all, the project
  lists fabricare/source/windows.json / windows.static.json / linux.json and
  their build order, fabricare/library.js (forEachProject, getReleaseInfo,
  hasRelease, decodeSeparateData), the tests in test/ (fabricare test,
  --run-script) and process.platform.cmd / process.version-minor.cmd. Use
  when working in the xyo-sdk folder, building / testing / versioning /
  releasing all the XYO projects at once, adding a project to the SDK, or
  when the user mentions xyo-sdk, "build everything", "all projects", or the
  project lists.
---

# xyo-sdk

Control repository of the XYO C++ stack. No code of its own: fabricare
scripts (Quantum Script) in `fabricare/` that run one action over **all**
the XYO repositories, cloned **next to** `xyo-sdk` (`../<project>`), in
dependency order. Each project is built with fabricare and installed into
the SDK repository `~/.fabricare/<platform>`, where the next projects find
it.

Full documentation: `docs/` — README (purpose), getting-started, commands,
project-lists, versions-and-releases, development. Read the matching page
when you need more than this summary. The scripts are short; read them in
`fabricare/` for the exact behavior. For fabricare itself (actions,
platforms, `fabricare.json`) use the **fabricare** skill.

## Commands (run in the xyo-sdk folder)

| Command | Effect |
|---------|--------|
| `fabricare git-clone` | clone missing projects into `..` (`git clone --depth 1`), `git pull origin main` the others; server `XYO_SDK_SOURCE_GIT` or `https://github.com/g-stefan` |
| `fabricare --sdk` | `make` + `install` in every project, in order |
| `fabricare --sdk <action>` | `fabricare <action>` in every project (`clean`, `test`, `version`, `version-minor`, `release`, ...) |
| `fabricare platform` | `platform.windows` (win64-msvc-2026, .static) then `platform.ubuntu` (wsl-ubuntu-24.04, 26.04): per project install-from-release if the release exists, else clean / make / install / release / clean |
| `fabricare platform-install-from-release[.windows\|.ubuntu]` | only install existing releases, report the missing ones |
| `fabricare has-no-release [--for-platform=name]` | list projects without a release of their current version |
| `fabricare dependency-version [--use-no-release] [--commit]` | list projects built against an older version of a dependency; `--commit` runs `version-patch` in them |
| `fabricare release` | write `release/xyo-sdk-<version>[.static].json`: version + release files of every project |
| `fabricare release-remove-all` | **delete** `release/` in every project |
| `fabricare test` | tests of the xyo-sdk scripts (`fabricare --sdk test` = tests of all projects) |

Flags: `--no-vendor` (skip `vendor-*`), `--only-vendor`, `--static`
(`windows.static.json`). Without `--sdk`, a non-SDK action runs on xyo-sdk
itself, which has no projects: `make` / `version` do nothing. The SDK version
(`version.json`) is bumped with `xyo-version --project=xyo-sdk --bump-minor`.
Shortcuts: `process.platform.cmd` = `fabricare platform`,
`process.version-minor.cmd` = `fabricare --sdk --no-vendor version-minor`.

On Windows, from Claude Code clear `NoDefaultCurrentDirectoryInExePath` (see
the fabricare skill) or call `vcvarsall.bat` by its full path.

## Project lists — `fabricare/source/*.json`

`{ "NN.category": ["project", ...], ... }`, run in file order. Loaded by
`library.js`: Windows → `windows.json`, Windows static (`--static` or a
`.static` platform) → `windows.static.json`, Linux → `linux.json`.

Rules (checked by `fabricare test`):

- **Build order**: a project after every project it depends on — the
  `dependency` lists of all its `fabricare.json` projects, test projects and
  `osWindows` / `osLinux` blocks included (test 03, reads `../*/fabricare.json`).
- A name once per list; `windows.static.json` = `windows.json` minus the
  projects with no static build, same order; `linux.json` ⊂ `windows.json`,
  no `vendor-*` (system packages from `fabricare/setup/ubuntu.sh` replace
  them); Windows only projects in a category named `...windows...` (test 01).

Adding a project: put its folder name in `windows.json` after its
dependencies, at the same place in `windows.static.json` if it builds
static, in `linux.json` if cross-platform and not vendor; `vendor-` prefix
for third party libraries; run `fabricare test`.

## Script pattern — `fabricare/*.js`

```javascript
Fabricare.include("library");      // projectList + forEachProject(fn) + helpers

forEachProject(function(project) {            // vendor filters applied
	runInPath("../" + project, function() {
		if (Shell.system("fabricare clean")) {
			throw ("clean");                  // -> exit(1, "clean")
		};
	});
});
```

`library.js` helpers: `forEachProject(fn)` (replaces fabricare's
`forEachProject(category, fn)` in these scripts), `getReleasePlatform()`
(`--for-platform` or `Platform.name`), `getReleaseInfo(platform, useConPTY)`
/ `hasRelease(...)` (run `fabricare --for-platform=... --separate-data=#JSON#
release-exists` in the current project folder), `decodeSeparateData(output)`,
`includeLocal(file)`. Never hard-code a platform name for release checks;
use `getReleasePlatform()`. Quantum Script style: `};` after blocks, tabs,
CRLF line endings (the `setup/*.sh` files are LF).

## Tests — `test/`

`fabricare test` → `fabricare/test.js` → `fabricare --run-script=test/test.NN.js`
(no platform, no solution). `test/test.common.js` includes
`fabricare://solution/generic.library.js` and `library.js`, sets
`Platform.name = "test-platform"`, provides `check(name, value, expected)`,
`checkTrue`, `testDone()`, `readJSON`, `projectNames(list)`,
`forEachProjectNames()`. New test: `test/test.NN.js` with
`var testName = "NN"; Script.include("test/test.common.js"); ... testDone();`
and raise the loop count in `fabricare/test.js`. Run one alone:
`fabricare --run-script=test/test.03.js`.

## Licenses

REUSE via `REUSE.toml`: scripts / JSON / `.cmd` / tests / `.claude` →
Unlicense, `README.md` / `docs/` → MIT. Check with `python -m reuse lint`.
