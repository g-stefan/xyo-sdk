// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022-2026 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

global.projectList = {};

if (OS.isWindows()) {
	if (Fabricare.isDynamic()) {
		global.projectList = JSON.decode(Shell.fileGetContents("fabricare/source/windows.json"));
	};
	if (Fabricare.isStatic()) {
		global.projectList = JSON.decode(Shell.fileGetContents("fabricare/source/windows.static.json"));
	};
};
if (OS.isLinux()) {
	global.projectList = JSON.decode(Shell.fileGetContents("fabricare/source/linux.json"));
};

global.noVendor = Application.hasFlag("no-vendor");
global.onlyVendor = Application.hasFlag("only-vendor");

global.forEachProject = function(fn) {
	try {
		for (var projectCategory of global.projectList) {
			for (var project of projectCategory) {

				if (global.noVendor) {
					if (project.indexOf("vendor-") >= 0) {
						continue;
					};
				};
				if (global.onlyVendor) {
					if (project.indexOf("vendor-") < 0) {
						continue;
					};
				};

				fn(project);
			};
		};

	} catch (e) {
		exit(1, e.message);
	};
};

// Platform of the releases to look for: --for-platform=name, or the current one
global.getReleasePlatform = function() {
	return Application.getFlagValue("for-platform", Platform.name);
};

// The JSON printed after the marker by "fabricare --separate-data=#JSON# action",
// null if the command failed or printed no data
global.decodeSeparateData = function(output) {
	if (Script.isNil(output)) {
		return null;
	};
	var data = output.split("#JSON#");
	if (data.length < 2) {
		return null;
	};
	var json = JSON.decode(data[1]);
	if (Script.isNil(json)) {
		return null;
	};
	return json;
};

// Release info of the project in the current folder for platform:
// {exists, release}, null if unknown
global.getReleaseInfo = function(platform, useConPTY) {
	var cmd = "fabricare --for-platform=" + platform + " --separate-data=#JSON# release-exists";
	if (Script.isNil(useConPTY)) {
		return decodeSeparateData(ProcessInteractive.run(cmd));
	};
	return decodeSeparateData(ProcessInteractive.run(cmd, useConPTY));
};

// true if the project in the current folder has a release for platform
global.hasRelease = function(platform, useConPTY) {
	var json = getReleaseInfo(platform, useConPTY);
	if (Script.isNil(json)) {
		return false;
	};
	return json.exists;
};

global.includeLocal = function(file) {
	var local = Shell.getcwd() + "/fabricare/" + file + ".js";

	if (Shell.fileExists(local)) {
		Script.include(local);
		return true;
	};
	return false;
};
