# XYO SDK

Scripts to manage SDK
- Runs one fabricare action over all the XYO C++ repositories, cloned next to `xyo-sdk`,
in dependency order: `fabricare --sdk [action]`.
- Clones / updates every project: `fabricare git-clone`.
- Builds or installs from release for every platform (Windows MSVC, static, WSL Ubuntu):
`fabricare platform`.
- Keeps versions consistent (`dependency-version`), finds unreleased projects
(`has-no-release`), writes the SDK release manifest (`release`).
- Project lists for Windows, Windows static and Linux in `fabricare/source/`.

## Documentation

- [Overview](docs/README.md) - purpose and design
- [Getting started](docs/getting-started.md) - prerequisites, folder layout, the first full build
- [Commands](docs/commands.md) - every action and flag, the `--sdk` workspace mode
- [Project lists](docs/project-lists.md) - the build order, adding a project
- [Versions and releases](docs/versions-and-releases.md) - `dependency-version`, `has-no-release`, `release`
- [Development](docs/development.md) - the scripts, the tests, licenses

A Claude Code skill for xyo-sdk is in
[.claude/skills/xyo-sdk](.claude/skills/xyo-sdk/SKILL.md).

## License

Copyright (c) 2020-2026 Grigore Stefan
Licensed under the [MIT](LICENSE) license.
