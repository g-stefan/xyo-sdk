// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

// --- windows

global.projectList = JSON.decode(Shell.fileGetContents("fabricare/source/windows.json"));

var platformList = [
	"win32-msvc-2017",
	"win64-msvc-2017",
	"win32-msvc-2019",
	"win64-msvc-2019",
	"win32-msvc-2022",
	"win64-msvc-2022",
];

forEachProject(function(project) {
	runInPath("../" + project, function() {		
		for(var platform of platformList) {
			exitIf(Shell.system("fabricare --platform="+platform+" clean"));
			exitIf(Shell.system("fabricare --platform="+platform+" default"));
			exitIf(Shell.system("fabricare --platform="+platform+" install"));
			exitIf(Shell.system("fabricare --platform="+platform+" release"));
			exitIf(Shell.system("fabricare --platform="+platform+" clean"));
		};
	});
});

// --- linux

global.projectList = JSON.decode(Shell.fileGetContents("fabricare/source/linux.json"));

var platformList = [
	"sys-mingw32",
	"sys-mingw64",
	"wsl-ubuntu-18.04",
	"wsl-ubuntu-20.04",
	"wsl-ubuntu-22.04"
];

forEachProject(function(project) {
	runInPath("../" + project, function() {
		for(var platform of platformList) {
			exitIf(Shell.system("fabricare --platform="+platform+" clean"));
			exitIf(Shell.system("fabricare --platform="+platform+" default"));
			exitIf(Shell.system("fabricare --platform="+platform+" install"));
			exitIf(Shell.system("fabricare --platform="+platform+" release"));
			exitIf(Shell.system("fabricare --platform="+platform+" clean"));
		};
	});
});
