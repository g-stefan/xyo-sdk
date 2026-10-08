# Commands

Run every command in the `xyo-sdk` folder:

```
fabricare [flags] [action]
```

There are two kinds of commands:

- **SDK actions** — `git-clone`, `platform`, `release`, ... — are scripts in
  `xyo-sdk/fabricare/`. They loop over the project list themselves.
- **Workspace mode** — `fabricare --sdk <action>` — runs `fabricare <action>`
  in every project. Any fabricare action works (`make`, `install`, `clean`,
  `test`, `version`, `release`, ...).

Without `--sdk`, an action that is not an SDK action runs on `xyo-sdk`
itself. It has no projects, so `fabricare make` or `fabricare version` do
nothing there; forgetting `--sdk` is harmless.

## Flags

| Flag | Effect |
|------|--------|
| `--sdk` | workspace mode: run the action in every project of the list |
| `--no-vendor` | skip the `vendor-*` projects |
| `--only-vendor` | only the `vendor-*` projects |
| `--static` | use the static project list (`windows.static.json`) |
| `--for-platform=name` | `has-no-release`, `dependency-version --use-no-release`: look for the releases of that platform instead of the current one |
| `--use-no-release` | `dependency-version`: also count the projects without a release as changed |
| `--commit` | `dependency-version`: bump the versions, not only list them |
| `--platform=name` | fabricare: run on that platform (`win64-msvc-2026.static`, ...) |

| Environment variable | Effect |
|----------------------|--------|
| `XYO_SDK_SOURCE_GIT` | `git-clone`: server to clone from, default `https://github.com/g-stefan` |

## Which projects

The scripts load the project list of the system they run on (see
[Project lists](project-lists.md)):

| System | List |
|--------|------|
| Windows | `fabricare/source/windows.json` |
| Windows, static (`--static` or a `.static` platform) | `fabricare/source/windows.static.json` |
| Linux | `fabricare/source/linux.json` |

The projects run in list order. The first error stops the command.

## Workspace mode: `--sdk`

```
fabricare --sdk               # make + install in every project
fabricare --sdk <action>      # fabricare <action> in every project
```

With no action, each project gets `fabricare make` then `fabricare install`.
An error stops with `[project] action`.

Examples:

```
fabricare --sdk clean
fabricare --sdk --no-vendor test
fabricare --sdk --only-vendor make
fabricare --sdk --no-vendor version-minor    (process.version-minor.cmd)
```

## SDK actions

### git-clone

```
fabricare git-clone
```

For each project: `git clone --depth 1 <server>/<project>` into `..` when it
is missing, `git pull origin main` when it is there. The server is
`XYO_SDK_SOURCE_GIT` or `https://github.com/g-stefan`.

### platform

```
fabricare platform              # platform.windows, then platform.ubuntu
fabricare platform.windows      # win64-msvc-2026, win64-msvc-2026.static
fabricare platform.ubuntu       # wsl-ubuntu-24.04, wsl-ubuntu-26.04
```

For each platform and project (in `../<project>`):

- a release for that platform exists in `release/` →
  `clean`, `install-from-release`, `clean`;
- otherwise → `clean`, `make`, `install`, `release`, `clean`.

The WSL platforms also run `sync` first, which copies the project into WSL.
`platform.windows` uses `windows.static.json` for the static platform.
Run `platform` on Windows: `platform.ubuntu` drives WSL from Windows.
`process.platform.cmd` runs `fabricare platform`.

### platform-install-from-release

```
fabricare platform-install-from-release
fabricare platform-install-from-release.windows
fabricare platform-install-from-release.ubuntu
```

Like `platform`, but never builds: installs the existing releases into the
SDK repository of each platform and prints
`- <platform>: <project> release does not exists!` for the others.

### has-no-release

```
fabricare has-no-release
fabricare has-no-release --for-platform=win64-msvc-2026.static
```

Prints the projects that have no release of their current version for the
current platform (or `--for-platform`). These are the projects `platform`
would build.

### dependency-version

```
fabricare dependency-version
fabricare dependency-version --commit
fabricare dependency-version --use-no-release --commit
```

Lists the projects built against an older version of one of their
dependencies; `--commit` bumps their patch version. See
[Versions and releases](versions-and-releases.md#dependency-version).

### release

```
fabricare release
```

Writes `release/xyo-sdk-<version>.json` (`.static.json` for the static
list): for every project its version and release files. See
[Versions and releases](versions-and-releases.md#release).

### release-remove-all

```
fabricare release-remove-all
```

**Deletes** the `release/` folder of every project. Use it to force
`platform` to build everything again.

### test

```
fabricare test
```

Runs the tests of the `xyo-sdk` scripts (`test/test.NN.js`). To run the tests
of all projects use `fabricare --sdk test`.

## Shortcuts

| File | Runs |
|------|------|
| `process.platform.cmd` | `fabricare platform` |
| `process.version-minor.cmd` | `fabricare --sdk --no-vendor version-minor` |
