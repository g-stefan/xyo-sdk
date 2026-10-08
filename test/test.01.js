// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022-2026 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

// Project lists: fabricare/source/*.json

var testName = "01";
Script.include("test/test.common.js");

var listFile = {
	linux : "fabricare/source/linux.json",
	windows : "fabricare/source/windows.json",
	windowsStatic : "fabricare/source/windows.static.json"
};

var list = {};
var listSet = {};
var listCategory = {};

for (var key in listFile) {
	var json = readJSON(listFile[key]);
	checkTrue(key + " is an object", Script.isObject(json));
	if (!Script.isObject(json)) {
		continue;
	};

	// Every category is a list of project names, a name only once
	var names = [];
	var nameSet = {};
	var nameCategory = {};
	for (var category in json) {
		checkTrue(key + " " + category + " is an array", Script.isArray(json[category]));
		if (!Script.isArray(json[category])) {
			continue;
		};
		for (var project of json[category]) {
			checkTrue(key + " " + category + " name is a string", Script.isString(project));
			if (!Script.isString(project)) {
				continue;
			};
			check(key + " " + project + " name trimmed", project.trim(), project);
			check(key + " " + project + " no path", project.indexOf("/") + project.indexOf("\\"), -2);
			check(key + " " + project + " only once", nameSet[project], undefined);
			nameSet[project] = true;
			nameCategory[project] = category;
			names.push(project);
		};
	};
	checkTrue(key + " not empty", names.length > 0);
	list[key] = names;
	listSet[key] = nameSet;
	listCategory[key] = nameCategory;
};

// The base library first, the build tool last of the cross-platform projects
check("linux first", list.linux[0], "xyo-platform");
check("windows first", list.windows[0], "xyo-platform");
check("windows.static first", list.windowsStatic[0], "xyo-platform");
check("linux last", list.linux[list.linux.length - 1], "fabricare");

// windows.static is windows without some projects, in the same order
var position = 0;
for (var project of list.windowsStatic) {
	while ((position < list.windows.length) && (list.windows[position] != project)) {
		++position;
	};
	if (position >= list.windows.length) {
		check("windows.static " + project + " in windows, same order", false, true);
		break;
	};
	++position;
};

// linux has the cross-platform projects of windows, no vendor projects
// (the system packages replace them)
for (var project of list.linux) {
	check("linux " + project + " in windows", listSet.windows[project], true);
	check("linux " + project + " not vendor", project.indexOf("vendor-"), -1);
};
for (var project of list.windows) {
	if (project.indexOf("vendor-") == 0) {
		continue;
	};
	if (Script.isNil(listSet.linux[project])) {
		check("windows only " + project + " category", listCategory.windows[project].indexOf("windows") >= 0, true);
	};
};

// library.js loads the list of the current system
var expected = list.linux;
if (OS.isWindows()) {
	expected = list.windows;
	if (Fabricare.isStatic()) {
		expected = list.windowsStatic;
	};
};
check("library projectList", projectNames(global.projectList).join(","), expected.join(","));
check("library forEachProject", forEachProjectNames().join(","), expected.join(","));

testDone();
