# Project lists

The projects `xyo-sdk` works on, and their order, are in three JSON files:

| File | Used on |
|------|---------|
| `fabricare/source/windows.json` | Windows (MSVC), dynamic build |
| `fabricare/source/windows.static.json` | Windows, static build (`--static`, `win64-msvc-2026.static`) |
| `fabricare/source/linux.json` | Linux, and the WSL platforms of `platform.ubuntu` |

Each file is an object of **categories**, each category a list of project
(folder) names:

```json
{
	"01.cross-platform.1" : [
		"xyo-platform",
		"xyo-managed-memory",
		...
	],
	"02.windows-port" : [
		"vendor-lzma",
		...
	]
}
```

The scripts run the categories in file order and the projects in list order.
The category names only group the projects; the number prefix keeps the
order readable.

## The order is the build order

A project must come **after** every project it depends on: `fabricare --sdk`
installs each project into the SDK repository before it builds the next
one, and a project finds its dependencies only there. The dependencies are
the `dependency` lists (also those of the test projects and of the
`osWindows` / `osLinux` blocks) in the project's `fabricare.json`.

For example `quantum-script--http` has a test that needs
`quantum-script--socket` and `quantum-script--url`, so it comes after both.

`fabricare test` checks this (test 03) for the projects cloned next to
`xyo-sdk`.

## The three lists

- **windows.json** — the full list: the cross-platform libraries and tools,
  the Windows ports of third party libraries (`02.windows-port`: zlib,
  libpng, OpenSSL, ...), the second group of cross-platform projects that
  need them (`xyo-pixel32`, `quantum-script--*`, `fabricare`), the Windows
  only projects (`04.windows`) and the other vendor libraries.
- **windows.static.json** — the same, in the same order, without the
  projects that have no static build (`vendor-apr`, `vendor-apr-util`,
  `vendor-httpd`).
- **linux.json** — the cross-platform projects only. There are no `vendor-*`
  projects: on Linux the system packages (`fabricare/setup/ubuntu.sh`)
  provide zlib, libpng, libxml2, OpenSSL, ...

The tests check these rules (test 01): valid JSON, a name only once, the
static list in the same order as `windows.json`, every Linux project also in
`windows.json`, no vendor project on Linux, the Windows only projects in a
`windows` category.

## Adding a project

1. Create the repository next to `xyo-sdk` with its `fabricare.json`.
2. Add its folder name to `windows.json`, after all its dependencies. Use
   the `vendor-` prefix for third party libraries, so that `--no-vendor` /
   `--only-vendor` work.
3. Add it to `windows.static.json` at the same place, if it has a static
   build.
4. Add it to `linux.json` if it builds on Linux (not for `vendor-*`).
5. Run `fabricare test`.

## Removing a project

Remove the name from all three lists. Projects that depend on it must be
removed or changed first, or test 03 fails.
