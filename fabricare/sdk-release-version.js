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
		cmd += "\"--release-path=" + path + "/temp\" ";
		cmd += "\"--release-name=" + project + "\" ";
		cmd += "release-version";
		if (Shell.system(cmd)) {
			throw ("release-version");
		};
	});
});

var release = {};

var fileList = Shell.getFileList("temp/*.json");
for (var file of fileList) {
	var jsonContent = Shell.fileGetContents(file);
	if (!Script.isNil(jsonContent)) {
		var json = JSON.decode(jsonContent);
		if (!Script.isNil(json)) {
			if (Script.isNil(release[json.name])) {
				release[json.name] = [];
			};
			release[json.name][release[json.name].length] = json;
		};
	};
};

Console.writeLn(JSON.encodeWithIndentation(release));
