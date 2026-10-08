# XYO SDK — Documentation

`xyo-sdk` is the control repository of the XYO C++ projects. It has no code
of its own: it is a set of [fabricare](https://github.com/g-stefan/fabricare)
scripts that run one action over **all** the XYO repositories, in
dependency order, on every platform.

```
fabricare git-clone          # clone / update every project next to xyo-sdk
fabricare --sdk              # make + install every project, in order
fabricare --sdk test         # run the tests of every project
fabricare platform           # build or install from release, all platforms
fabricare release            # write the SDK release manifest
fabricare test               # test the xyo-sdk scripts themselves
```

## Purpose

The XYO stack is about a hundred small repositories: the libraries
(`xyo-platform`, `xyo-managed-memory`, ..., `xyo-system`), the tools
(`xyo-cc`, `file-to-rc`, ...), `quantum-script` and its extensions, the
Windows only projects and the `vendor-*` builds of third party libraries.
Each one is built with fabricare and installed into the SDK repository
`~/.fabricare/<platform>`, where the projects that depend on it find it.

Doing that by hand means knowing the order (a library must be installed
before the projects that use it), repeating it for every platform
(`win64-msvc-2026`, `win64-msvc-2026.static`, `wsl-ubuntu-24.04`,
`wsl-ubuntu-26.04`) and keeping versions consistent. `xyo-sdk` does it:

| Need | How xyo-sdk handles it |
|------|------------------------|
| Get all the sources | `git-clone` clones the missing projects next to `xyo-sdk` and pulls the others |
| Build everything in the right order | the project lists in `fabricare/source/*.json`, in dependency order; `--sdk` runs an action in each project |
| Only some projects | `--no-vendor` skips the `vendor-*` projects, `--only-vendor` keeps only them |
| All platforms in one go | `platform` builds (or installs from an existing release) for each Windows and WSL Ubuntu platform |
| Reuse what is already released | `platform-install-from-release`, `has-no-release` |
| Keep versions consistent | `dependency-version` finds the projects built against an older version of a dependency and bumps them |
| Know what an SDK version contains | `release` writes `release/xyo-sdk-<version>.json` with the version and release files of every project |

## Documentation

- [Getting started](getting-started.md) - prerequisites, folder layout, the first full build
- [Commands](commands.md) - every action and flag, the `--sdk` workspace mode
- [Project lists](project-lists.md) - `fabricare/source/*.json`, the build order, adding a project
- [Versions and releases](versions-and-releases.md) - `dependency-version`, `has-no-release`, `release`
- [Development](development.md) - the scripts, the tests, licenses

## Requirements

- [fabricare](https://github.com/g-stefan/fabricare) on `PATH`
  (installed in `~/.fabricare/<platform>/bin`).
- `git` and `7z` on `PATH`.
- Windows: Visual Studio 2026 (Build Tools or Community). For the WSL
  platforms: WSL with Ubuntu 24.04 / 26.04 and fabricare inside it.
- Linux: the packages of `fabricare/setup/ubuntu.sh`.

## License

Copyright (c) 2020-2026 Grigore Stefan.
Licensed under the [MIT](../LICENSE) license. The scripts in `fabricare/`
and `test/` are public domain (Unlicense).
