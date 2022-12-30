// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Shell.removeDirRecursively("temp");
Shell.mkdirRecursivelyIfNotExists("temp");

var path = Shell.getcwd();

var versionInfo = {};

forEachProject(function(project) {
	runInPath("../" + project, function() {
		var cmd = "fabricare ";
		cmd += "\"--dependency-path=" + path + "/temp\" ";
		cmd += "\"--dependency-name=" + project + "\" ";
		cmd += "dependency-version";
		if (Shell.system(cmd)) {
			throw ("dependency-version");
		};
	});
});

var dependency = {};

var fileList = Shell.getFileList("temp/*.json");
for (var file of fileList) {
	var jsonContent = Shell.fileGetContents(file);
	if (!Script.isNil(jsonContent)) {
		var json = JSON.decode(jsonContent);
		if (!Script.isNil(json)) {
			if (Script.isNil(dependency[json.name])) {
				dependency[json.name] = [];
			};
			dependency[json.name][dependency[json.name].length] = json;
		};
	};
};

var currentVersion = {};
for (var scan in dependency) {
	for (var info of dependency[scan]) {
		var project = info.project;
		if (!Script.isNil(info.make)) {
			project = info.project + "." + info.make;
		};
		var version = info.version.version;
		currentVersion[project] = version;
	};
	// Override if lib of dll
	for (var info of dependency[scan]) {
		if (info.make == "lib" || info.make == "dll" || info.make == "lib-and-dll") {
			var project = info.project;
			var version = info.version.version;
			currentVersion[project] = version;
		};
	};
};

var versionBump = {};
var hasVersionBump = false;
for (var scan in dependency) {
	for (var info of dependency[scan]) {
		var doBump = false;
		for (var version in info.dependency) {
			if (Script.isNil(currentVersion[version])) {
				continue;
			};
			if (currentVersion[version] != info.dependency[version]) {
				doBump = true;
				break;
			};
		};
		if (doBump) {
			if (Script.isNil(versionBump[info.name])) {
				versionBump[info.name] = {};
			};
			var project = info.project + "." + info.make;
			versionBump[info.name][project] = {name : info.name, project : info.project, make : info.make};
			hasVersionBump = true;
		};
	};
};

// Console.writeLn(JSON.encodeWithIndentation(dependency));
// Console.writeLn(JSON.encodeWithIndentation(currentVersion));
// Console.writeLn(JSON.encodeWithIndentation(versionBump));

if (!hasVersionBump) {
	Console.writeLn("* Nothing to do!");
	return;
};

Console.writeLn("--- projects");
for (var name in versionBump) {
	Console.writeLn(name + ":");
	for (var info of versionBump[name]) {
		if (!Script.isNil(info.make)) {
			Console.writeLn("\t- " + info.project + " [" + info.make + "]");
		} else {
			Console.writeLn("\t- " + info.name + ": " + info.project);
		};
	};
};

if (Application.hasFlag("commit")) {
	for (var name in versionBump) {
		for (var info of versionBump[name]) {
			if (!Script.isNil(info.make)) {
				runInPath("../" + name, function() {
					var cmd = "fabricare ";
					cmd += "\"--dependency-project=" + info.project + "\" ";
					cmd += "\"--dependency-make=" + info.make + "\" ";
					cmd += "version-patch";
					if (Shell.system(cmd)) {
						throw ("dependency-version commit");
					};
				});
			} else {
				runInPath("../" + name, function() {
					var cmd = "fabricare ";
					cmd += "\"--dependency-project=" + info.project + "\" ";
					cmd += "version-patch";
					if (Shell.system(cmd)) {
						throw ("dependency-version commit");
					};
				});
			};
		};
		runInPath("../" + name, function() {
			if (Shell.system("fabricare make")) {
				throw ("make");
			};
			if (Shell.system("fabricare install")) {
				throw ("install");
			};
		});
	};
};