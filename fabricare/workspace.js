// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022-2023 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

if (Application.hasFlag("sdk")) {
	Fabricare.include("solution/xyo-cpp.library");
	Fabricare.include("library");

	forEachProject(function(project) {
		runInPath("../" + project, function() {
			if(Fabricare.action=="default"){
				if (Shell.system("fabricare make")) {
					throw ("[ "+ project + "] " + "make");
				};
				if (Shell.system("fabricare install")) {
					throw ("[ "+ project + "] " + "install");
				};				
				return;
			};
			if (Shell.system("fabricare " + Fabricare.action)) {
				throw ("[ "+ project + "] " + Fabricare.action);
			};
		});
	});

	return;	
};

Fabricare.processSolution();
