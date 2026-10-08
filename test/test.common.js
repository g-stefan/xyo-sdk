// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022-2026 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

// Shared by the test scripts, run as:
//     fabricare --run-script=test/test.NN.js
// from the xyo-sdk folder. --run-script skips the platform selection and the
// solution, the tests load the scripts they need themselves.

var testFailed = 0;

function check(name, value, expected) {
	if (value === expected) {
		return;
	};
	Console.writeLn("-> test " + testName + " fail: " + name + " = [" + value + "], expected [" + expected + "]");
	++testFailed;
};

function checkTrue(name, value) {
	check(name, value, true);
};

function testDone() {
	if (testFailed) {
		throw "test " + testName + " failed";
	};
};

// The helpers of the action scripts (exitIf, runInPath, messageAction, ...)
Script.include("fabricare://solution/generic.library.js");

Platform.name = "test-platform";
Fabricare.action = "test";

// The xyo-sdk library: projectList, forEachProject, release helpers
Fabricare.include("library");

function readJSON(file) {
	var content = Shell.fileGetContents(file);
	if (Script.isNil(content)) {
		return null;
	};
	return JSON.decode(content);
};

// Project names of a project list, in order
function projectNames(projectList) {
	var retV = [];
	for (var projectCategory of projectList) {
		for (var project of projectCategory) {
			retV.push(project);
		};
	};
	return retV;
};

// Project names, in order, as forEachProject gives them
function forEachProjectNames() {
	var retV = [];
	forEachProject(function(project) {
		retV.push(project);
	});
	return retV;
};
