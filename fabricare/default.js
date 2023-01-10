// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022-2023 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

forEachProject(function(project) {
	runInPath("../" + project, function() {
		if (Shell.system("fabricare make")) {
			throw ("make");
		};
		if (Shell.system("fabricare install")) {
			throw ("install");
		};
	});
});
