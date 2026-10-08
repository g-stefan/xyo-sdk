// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022-2026 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

// Build order: every project comes after the projects it depends on.
// Reads the fabricare.json of the projects cloned next to xyo-sdk
// (fabricare git-clone), the projects not cloned are skipped.

var testName = "03";
Script.include("test/test.common.js");

var listFile = [
	"fabricare/source/linux.json",
	"fabricare/source/windows.json",
	"fabricare/source/windows.static.json"
];

// Folder of each library / program name, the dependencies of each folder
var owner = {};
var dependency = {};
var found = 0;

function addDependency(folder, value) {
	if (Script.isNil(value)) {
		return;
	};
	for (var name of [].concat(value)) {
		dependency[folder].push(name);
	};
};

function loadProject(folder) {
	if (!Script.isNil(dependency[folder])) {
		return;
	};
	dependency[folder] = [];
	var json = readJSON("../" + folder + "/fabricare.json");
	if (Script.isNil(json)) {
		return;
	};
	if (Script.isNil(json.solution)) {
		return;
	};
	++found;
	if (Script.isNil(owner[json.solution.name])) {
		owner[json.solution.name] = folder;
	};
	if (Script.isNil(json.solution.projects)) {
		return;
	};
	for (var project of json.solution.projects) {
		for (var name of [].concat(project.name)) {
			if (Script.isNil(owner[name])) {
				owner[name] = folder;
			};
		};
		addDependency(folder, project.dependency);
		if (!Script.isNil(project.osWindows)) {
			addDependency(folder, project.osWindows.dependency);
		};
		if (!Script.isNil(project.osLinux)) {
			addDependency(folder, project.osLinux.dependency);
		};
	};
};

var lists = [];
for (var file of listFile) {
	var projectList = readJSON(file);
	var names = projectNames(projectList);
	for (var project of names) {
		loadProject(project);
	};
	lists.push({file : file, names : names});
};

if (found == 0) {
	Console.writeLn("-> test " + testName + ": skipped, no projects next to xyo-sdk, run fabricare git-clone");
	testDone();
	return;
};

for (var info of lists) {
	var position = {};
	for (var index = 0; index < info.names.length; ++index) {
		position[info.names[index]] = index;
	};
	for (var index = 0; index < info.names.length; ++index) {
		var project = info.names[index];
		for (var name of dependency[project]) {
			// name.static is the static variant of name
			if ((name.length > 7) && (name.substring(name.length - 7) == ".static")) {
				name = name.substring(0, name.length - 7);
			};
			var folder = owner[name];
			if (Script.isNil(folder)) {
				// a system library (libz, libssl, ...)
				continue;
			};
			if (folder == project) {
				continue;
			};
			if (Script.isNil(position[folder])) {
				// on Linux the system packages replace the vendor projects
				if (folder.indexOf("vendor-") == 0) {
					continue;
				};
				check(info.file + ": " + project + " needs " + name + ", " + folder + " in list", false, true);
				continue;
			};
			check(info.file + ": " + project + " needs " + name + ", " + folder + " before", position[folder] < index, true);
		};
	};
};

testDone();
