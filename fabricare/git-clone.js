// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022-2024 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Fabricare.include("library");

var sourceHost = "https://github.com/g-stefan";
if (Shell.hasEnv("XYO_SDK_SOURCE_GIT")) {
	sourceHost = Shell.getenv("XYO_SDK_SOURCE_GIT");
};

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
