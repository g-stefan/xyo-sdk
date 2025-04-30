// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022-2025 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Fabricare.include("library");

forEachProject(function(project) {
	runInPath("../" + project, function() {
		Console.writeLn("- " + project);
		Shell.removeDirRecursively("release");
	});
});
