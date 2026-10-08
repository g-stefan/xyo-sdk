// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022-2026 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Fabricare.include("library");

var platform = getReleasePlatform();

forEachProject(function(project) {
	runInPath("../" + project, function() {
		if (hasRelease(platform)) {
			return;
		};
		Console.writeLn(project);
	});
});
