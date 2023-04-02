// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022-2023 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

argDebug="";
if(Application.hasFlag("debug")){
	argDebug=" --debug";
};

forEachProject(function(project) {
	runInPath("../" + project, function() {

		if (Shell.system("fabricare make"+argDebug)) {
			throw ("make");
		};
		if (Shell.system("fabricare install"+argDebug)) {
			throw ("install");
		};
	});
});

