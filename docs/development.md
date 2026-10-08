# Development

## Layout

```
xyo-sdk/
├── fabricare.json                 solution "xyo-sdk", type xyo-cpp, no projects
├── version.json                   version of the SDK (release manifest name)
├── fabricare/
│   ├── workspace.js               --sdk: run the action in every project
│   ├── library.js                 project list, forEachProject, release helpers
│   ├── git-clone.js               SDK actions, one file each
│   ├── platform*.js
│   ├── platform-install-from-release*.js
│   ├── dependency-version.js
│   ├── has-no-release.js
│   ├── release.js
│   ├── release-remove-all.js
│   ├── test.js                    runs test/test.NN.js
│   ├── source/                    project lists (windows, windows.static, linux)
│   └── setup/                     system packages: ubuntu.sh, mingw32.sh, mingw64.sh
├── process.platform.cmd           fabricare platform
├── process.version-minor.cmd      fabricare --sdk --no-vendor version-minor
├── test/                          tests of the scripts
└── docs/
```

`temp/` (the data collected by `release` and `dependency-version`) and
`release/` (the SDK release manifests) are created by the commands and are
not in git.

## How a command runs

The scripts are [Quantum Script](https://github.com/g-stefan/quantum-script)
run by fabricare (see the fabricare documentation, *Writing scripts*).

1. fabricare selects the platform and, on Windows, starts itself again
   inside the Visual Studio environment.
2. It finds `fabricare/workspace.js` and runs it instead of the solution.
3. With `--sdk`, `workspace.js` runs `fabricare <action>` in every project
   (`make` + `install` for the default action).
4. Without `--sdk`, the solution runs and the action is looked up as usual:
   `fabricare/<action>.js` in `xyo-sdk` first, so `git-clone`, `platform`,
   `release`, ... are the scripts of this folder.

Every SDK action starts with `Fabricare.include("library")`, which loads the
project list of the system and replaces `forEachProject(fn)`: it calls
`fn(projectName)` for each project, applying `--no-vendor` / `--only-vendor`,
and turns an exception into `exit(1, message)`. Together with
`runInPath("../" + project, fn)` this is the pattern of every script:

```javascript
Fabricare.include("library");

forEachProject(function(project) {
	runInPath("../" + project, function() {
		if (Shell.system("fabricare clean")) {
			throw ("clean");
		};
	});
});
```

The helpers of `library.js`:

| Name | Use |
|------|-----|
| `projectList` | the loaded list: `{category: [project, ...]}` |
| `forEachProject(fn)` | `fn(project)` for each project, in order, with the vendor filters |
| `getReleasePlatform()` | `--for-platform`, or the current platform |
| `getReleaseInfo(platform, useConPTY)` | in a project folder: `{exists, release}` of `fabricare release-exists`, `null` if unknown |
| `hasRelease(platform, useConPTY)` | `true` if that release exists |
| `decodeSeparateData(output)` | the JSON after `#JSON#` in the output of `fabricare --separate-data=#JSON# ...` |
| `includeLocal(file)` | include `fabricare/<file>.js` of the current folder if it exists |

## Tests

```
fabricare test
```

`fabricare/test.js` runs `fabricare --run-script=test/test.NN.js` for each
test. `--run-script` runs the script directly, without platform or
solution; `test/test.common.js` loads the fabricare helpers and `library.js`
and provides `check(name, value, expected)`, `checkTrue` and `testDone`.
A test can also be run alone:

```
fabricare --run-script=test/test.02.js
```

| Test | Checks |
|------|--------|
| `test.01` | the project lists: valid, a name only once, the static list a subsequence of `windows.json`, the Linux list inside it without vendor projects, `library.js` loads the list of the system |
| `test.02` | `forEachProject` with `--no-vendor` / `--only-vendor`, `decodeSeparateData`, `getReleasePlatform` |
| `test.03` | the build order: in every list each project comes after its dependencies, read from the `fabricare.json` of the projects cloned next to `xyo-sdk` (skipped when there are none) |

To add a test: write `test/test.NN.js` (start with `var testName = "NN";`
and `Script.include("test/test.common.js");`, end with `testDone();`) and
raise the count in `fabricare/test.js`.

## Licenses

The repository follows [REUSE](https://reuse.software). The scripts carry
SPDX headers; the other files (JSON, `.cmd`, docs) are covered by
`REUSE.toml`. Check with:

```
python -m reuse lint
```
