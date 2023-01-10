// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022-2023 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Script.include("fabricare/library.js");

// ---

Solution.name = "xyo-sdk";
Fabricare.action = Application.getArgument(0, "default");

if (includeLocal(Fabricare.action)) {
	return;
};

forEachProject(function(project) {
	runInPath("../" + project, function() {
		if (Shell.system("fabricare " + Fabricare.action)) {
			throw (Fabricare.action);
		};
	});
});
