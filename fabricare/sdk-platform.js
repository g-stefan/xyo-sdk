// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

// --- windows

global.projectList = JSON.decode(Shell.fileGetContents("fabricare/source/windows.json"));

var platformList = [
	"win32-msvc-2022",
	"win64-msvc-2022"
];

for (var platform of platformList) {
	forEachProject(function(project) {
		runInPath("../" + project, function() {
			var json = JSON.decode(Fabricare.runInteractive("fabricare --for-platform=" + platform + " --separate-data=#JSON# release-exists").split("#JSON#")[1]);
			if (!Script.isNil(json)) {
				if(json.exists){
					Console.writeLn("- "+project+" release-exists");
					return;
				};
			};
			exitIf(Shell.system("fabricare --platform=" + platform + " clean"));
			exitIf(Shell.system("fabricare --platform=" + platform + " default"));
			exitIf(Shell.system("fabricare --platform=" + platform + " install"));
			exitIf(Shell.system("fabricare --platform=" + platform + " release"));
			exitIf(Shell.system("fabricare --platform=" + platform + " release-install"));
			exitIf(Shell.system("fabricare --platform=" + platform + " clean"));
		});
	});
};

// --- linux or linux like

global.projectList = JSON.decode(Shell.fileGetContents("fabricare/source/linux.json"));

var platformList = [
	"sys-mingw32",
	"sys-mingw64",
	"wsl-ubuntu-22.04"
];

for (var platform of platformList) {
	forEachProject(function(project) {
		runInPath("../" + project, function() {
			var json = JSON.decode(Fabricare.runInteractive("fabricare --for-platform=" + platform + " --separate-data=#JSON# release-exists",false).split("#JSON#")[1]);
			if (!Script.isNil(json)) {
				if(json.exists){
					Console.writeLn("- "+project+" release-exists");
					return;
				};
			};
			exitIf(Shell.system("fabricare --platform=" + platform + " clean"));
			exitIf(Shell.system("fabricare --platform=" + platform + " default"));
			exitIf(Shell.system("fabricare --platform=" + platform + " install"));
			exitIf(Shell.system("fabricare --platform=" + platform + " release"));
			exitIf(Shell.system("fabricare --platform=" + platform + " release-install"));
			exitIf(Shell.system("fabricare --platform=" + platform + " clean"));
		});
	});
};
