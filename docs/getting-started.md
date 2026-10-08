# Getting started

## Folder layout

`xyo-sdk` works on the projects cloned **next to it**: every script runs
`../<project>`. Keep all the XYO repositories in one folder:

```
CPP/
├── xyo-sdk/              <- run the commands here
├── xyo-platform/
├── xyo-managed-memory/
├── ...
├── fabricare/
└── vendor-zlib/
```

## Prerequisites

1. **fabricare** on `PATH`. Download a release of
   [fabricare](https://github.com/g-stefan/fabricare) and run
   `fabricare fabricare.self-install` from its `bin` folder; it copies itself
   to `~/.fabricare/<platform>/bin` and adds that folder to `PATH`.
2. **git** and **7z** on `PATH`.
3. A compiler:
   - Windows: Visual Studio 2026. fabricare finds `vcvarsall.bat` and enters
     the compiler environment by itself, no developer prompt is needed.
   - Ubuntu: run `fabricare/setup/ubuntu.sh` once (build-essential, git,
     cmake, 7z, zlib, bzip2, libpng, libxml2, libxslt, OpenSSL, rsync).
   - MSYS2: `fabricare/setup/mingw64.sh` or `mingw32.sh`.

## Get the sources

```
git clone https://github.com/g-stefan/xyo-sdk
cd xyo-sdk
fabricare git-clone
```

`git-clone` clones every project of the list for this system into `..`
(`git clone --depth 1`), or runs `git pull origin main` in the projects
already there. To clone from another server set `XYO_SDK_SOURCE_GIT`:

```
set XYO_SDK_SOURCE_GIT=https://gitea.example.com/xyo      (Windows)
export XYO_SDK_SOURCE_GIT=https://gitea.example.com/xyo   (Linux)
```

## Build and install everything

```
fabricare --sdk
```

For each project, in list order, this runs `fabricare make` and then
`fabricare install`, so each library is in `~/.fabricare/<platform>` before
the projects that need it are built. It stops at the first failure with
`[project] make` (or `install`).

Any other action runs the same way, project after project:

```
fabricare --sdk clean           # clean every project
fabricare --sdk test            # run the tests of every project
fabricare --sdk version         # bump the build number of every project
fabricare --sdk --no-vendor make
```

## Build for all platforms

```
fabricare platform
```

Runs `platform.windows` (`win64-msvc-2026`, `win64-msvc-2026.static`) and
then `platform.ubuntu` (`wsl-ubuntu-24.04`, `wsl-ubuntu-26.04`). For every
project and platform it installs the existing release if there is one,
otherwise it builds, installs and makes the release. `process.platform.cmd`
is a shortcut for this command. See [Commands](commands.md#platform).

## Check the scripts

```
fabricare test
```

Runs the tests in `test/`: the project lists are valid, consistent and in
dependency order, and the helpers of `fabricare/library.js` work. See
[Development](development.md#tests).

## The everyday cycle

```
fabricare git-clone                     # update the sources
fabricare --sdk                         # build + install what changed
fabricare --sdk test                    # test everything
fabricare dependency-version            # who needs a version bump?
fabricare dependency-version --commit   # bump them
fabricare platform                      # all platforms, releases
fabricare release                       # SDK release manifest
```
