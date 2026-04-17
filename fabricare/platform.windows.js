// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022-2026 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Fabricare.include("library");

// --- windows

var platformList = [
	"win64-msvc-2022",
	"win64-msvc-2022.static"
];

for (var platform of platformList) {
	global.projectList = JSON.decode(Shell.fileGetContents("fabricare/source/windows.json"));
	if (platform == "win64-msvc-2022.static") {
		global.projectList = JSON.decode(Shell.fileGetContents("fabricare/source/windows.static.json"));
	};

	forEachProject(function (project) {
		runInPath("../" + project, function () {
			var json = JSON.decode(ProcessInteractive.run("fabricare --for-platform=" + platform + " --separate-data=#JSON# release-exists").split("#JSON#")[1]);
			if (!Script.isNil(json)) {
				if (json.exists) {
					Console.writeLn("- " + platform + ": " + project + " release exists");
					exitIf(Shell.system("fabricare --platform=" + platform + " clean"));
					exitIf(Shell.system("fabricare --platform=" + platform + " install-from-release"));
					exitIf(Shell.system("fabricare --platform=" + platform + " release-install"));
					exitIf(Shell.system("fabricare --platform=" + platform + " clean"));
					return;
				};
			};
			Console.writeLn("- " + platform + ": " + project + " release build");
			exitIf(Shell.system("fabricare --platform=" + platform + " clean"));
			exitIf(Shell.system("fabricare --platform=" + platform + " make"));
			exitIf(Shell.system("fabricare --platform=" + platform + " install"));
			exitIf(Shell.system("fabricare --platform=" + platform + " release"));
			exitIf(Shell.system("fabricare --platform=" + platform + " release-install"));
			exitIf(Shell.system("fabricare --platform=" + platform + " clean"));
		});
	});
};

