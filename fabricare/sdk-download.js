// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

var sourceHost = "https://github.com/g-stefan";

forEachProject(function(project) {
	messageAction(Fabricare.action + " - " + project);
	runInPath("..", function() {
		if (!Shell.directoryExists(project)) {
			if (Shell.system("git clone --depth 1 \"" + sourceHost + "/" + project + "\"")) {
				throw ("download");
			};
		} else {
			runInPath(project, function() {
				if (Shell.system("git pull origin main")) {
					throw ("update");
				};
			});
		};
	});
});
