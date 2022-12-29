// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

// --- windows

global.projectList = JSON.decode(Shell.fileGetContents("fabricare/source/windows.json"));

forEachProject(function(project) {
	runInPath("../" + project, function() {
		Shell.removeDirRecursively("release");
	});
});

// --- linux

global.projectList = JSON.decode(Shell.fileGetContents("fabricare/source/linux.json"));

forEachProject(function(project) {
	runInPath("../" + project, function() {
		Console.writeLn("- "+project);
		Shell.removeDirRecursively("release");
	});
});
