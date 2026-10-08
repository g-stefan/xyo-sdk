# Versions and releases

Every project has its own version in its `version.json` and its own releases
in its `release/` folder (`fabricare release`), named
`xyo.<project>.v<version>.<platform>.bin.zip` / `.dev.zip`. `xyo-sdk` keeps
them consistent across all projects.

## Bumping versions

| Command | Effect in every project |
|---------|-------------------------|
| `fabricare --sdk version` | build number |
| `fabricare --sdk version-patch` | patch version |
| `fabricare --sdk --no-vendor version-minor` | minor version, not the vendor projects (`process.version-minor.cmd`) |
| `fabricare --sdk version-major` | major version |

## dependency-version

```
fabricare dependency-version
fabricare dependency-version --commit
fabricare dependency-version --use-no-release --commit
```

Finds the projects that must get a new version because a dependency
changed:

1. In every project it runs `fabricare dependency-version`, which writes
   into `xyo-sdk/temp/` the version of each of its projects and the version
   of each dependency it is built against (the library descriptor
   `lib/<name>.json` in the SDK repository).
2. A project whose dependency has, in its `version.json`, another version
   than the one the project is built against needs a bump.
3. It prints them:

   ```
   --- projects
   quantum-script--http:
   	- quantum-script--http [dll-or-lib]
   ```

   or `* Nothing to do!`.
4. With `--commit` it runs `fabricare version-patch` in each of them.

`--use-no-release` also uses the releases (for the current platform, or
`--for-platform=name`):

- a dependency without a release of its current version counts as changed,
  so the projects using it are bumped too;
- a project without a release of its current version is not bumped: that
  version is not published yet, it can take the change as it is.

Bumping a project changes its version, which can make more projects need a
bump: run `dependency-version` again until it prints `* Nothing to do!`.

## has-no-release

```
fabricare has-no-release
fabricare has-no-release --for-platform=wsl-ubuntu-26.04
```

Prints, in build order, the projects that have no release of their current
version for the platform. For the WSL platforms the release is named after
the Linux platform (`ubuntu-26.04`).

## release-remove-all

```
fabricare release-remove-all
```

Deletes the `release/` folder of every project. After that `platform`
builds every project again instead of installing from release.

## release

```
fabricare release
fabricare --static release
```

Runs `fabricare release-version` in every project and writes the SDK
release manifest `release/xyo-sdk-<version>.json` (or
`xyo-sdk-<version>.static.json` with the static list), `<version>` being the
version of `xyo-sdk` in its `version.json`:

```json
{
	"xyo-platform": {
		"version": "2.0.0",
		"release": [
			"xyo.xyo-platform.v2.0.0.win64-msvc-2026.bin.zip",
			"xyo.xyo-platform.v2.0.0.win64-msvc-2026.dev.zip"
		]
	},
	...
}
```

Projects with `"hasRelease": false` in their `fabricare.json` are not in
the manifest.

`xyo-sdk` has no projects of its own, so `fabricare version` (without
`--sdk`) does nothing here. Bump the SDK version with the `xyo-version` tool
(in `~/.fabricare/<platform>/bin`):

```
xyo-version --project=xyo-sdk --bump-minor
```
