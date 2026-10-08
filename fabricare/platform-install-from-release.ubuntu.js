// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022-2026 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Fabricare.include("library");

// --- ubuntu

global.projectList = JSON.decode(Shell.fileGetContents("fabricare/source/linux.json"));

var platformList = [
	"wsl-ubuntu-24.04",
	"wsl-ubuntu-26.04"
];

for (var platform of platformList) {
	forEachProject(function (project) {
		runInPath("../" + project, function () {
			var json = getReleaseInfo(platform, false);
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

