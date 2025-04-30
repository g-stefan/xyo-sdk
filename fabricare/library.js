// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022-2025 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

global.projectList = {};

if (OS.isWindows()) {
	if (Fabricare.isDynamic()) {
		global.projectList = JSON.decode(Shell.fileGetContents("fabricare/source/windows.json"));
	};
	if (Fabricare.isStatic()) {
		global.projectList = JSON.decode(Shell.fileGetContents("fabricare/source/windows.static.json"));
	};
};
if (OS.isLinux()) {
	global.projectList = JSON.decode(Shell.fileGetContents("fabricare/source/linux.json"));
};

global.noVendor = Application.hasFlag("no-vendor");
global.onlyVendor = Application.hasFlag("only-vendor");

global.forEachProject = function(fn) {
	try {
		for (var projectCategory of global.projectList) {
			for (var project of projectCategory) {

				if (global.noVendor) {
					if (project.indexOf("vendor-") >= 0) {
						continue;
					};
				};
				if (global.onlyVendor) {
					if (project.indexOf("vendor-") < 0) {
						continue;
					};
				};

				fn(project);
			};
		};

	} catch (e) {
		exit(1, e.message);
	};
};

global.includeLocal = function(file) {
	var local = Shell.getcwd() + "/fabricare/" + file + ".js";

	if (Shell.fileExists(local)) {
		Script.include(local);
		return true;
	};
	return false;
};
