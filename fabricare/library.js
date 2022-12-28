// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Fabricare.include("project/xyo-cpp.library");

global.projectList = {};

if (OS.isWindows()) {
	global.projectList = JSON.decode(Shell.fileGetContents("fabricare/source/windows.json"));
};
if (OS.isLinux()) {
	global.projectList = JSON.decode(Shell.fileGetContents("fabricare/source/linux.json"));
};

global.forEachProject = function(fn) {
	try {

		for (var projectCategory of global.projectList) {
			for (var project of projectCategory) {
				fn(project);
			};
		};

	} catch (e) {
		Console.writeLn("Error: " + e);
		exit(1);
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
