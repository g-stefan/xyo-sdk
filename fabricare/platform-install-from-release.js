// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022-2023 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Fabricare.include("library");

// --- windows

global.projectList = JSON.decode(Shell.fileGetContents("fabricare/source/windows.json"));

var platformList = [
	"win64-msvc-2022"
];

for (var platform of platformList) {
	forEachProject(function(project) {
		runInPath("../" + project, function() {
			var json = JSON.decode(ProcessInteractive.run("fabricare --for-platform=" + platform + " --separate-data=#JSON# release-exists").split("#JSON#")[1]);
			if (Script.isNil(json)) {
				Console.writeLn("- " + platform + ": " + project + " release not found!");
				return;
			};
			if (!json.exists) {
				Console.writeLn("- " + platform + ": " + project + " release does not exists!");
				return;
			};
			Console.writeLn("- " + platform + ": " + project + " install-from-release");
			exitIf(Shell.system("fabricare --platform=" + platform + " clean"));
			exitIf(Shell.system("fabricare --platform=" + platform + " install-from-release"));
			exitIf(Shell.system("fabricare --platform=" + platform + " clean"));
		});
	});
};

// --- linux or linux like

global.projectList = JSON.decode(Shell.fileGetContents("fabricare/source/linux.json"));

var platformList = [
	"wsl-ubuntu-22.04"
];

for (var platform of platformList) {
	forEachProject(function(project) {
		runInPath("../" + project, function() {
			var json = JSON.decode(ProcessInteractive.run("fabricare --for-platform=" + platform + " --separate-data=#JSON# release-exists", false).split("#JSON#")[1]);
			if (Script.isNil(json)) {
				Console.writeLn("- " + platform + ": " + project + " release not found!");
				return;
			};
			if (!json.exists) {
				Console.writeLn("- " + platform + ": " + project + " release does not exists!");
				return;
			};
			Console.writeLn("- " + platform + ": " + project + " install-from-release");
			exitIf(Shell.system("fabricare --platform=" + platform + " clean"));
			exitIf(Shell.system("fabricare --platform=" + platform + " sync"));
			exitIf(Shell.system("fabricare --platform=" + platform + " install-from-release"));
			exitIf(Shell.system("fabricare --platform=" + platform + " clean"));
		});
	});
};
