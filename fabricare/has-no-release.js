// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022-2024 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Fabricare.include("library");

Shell.removeDirRecursively("temp");
Shell.mkdirRecursivelyIfNotExists("temp");

var platform = "win64-msvc-2022";

forEachProject(function(project) {
	runInPath("../" + project, function() {
		var json = JSON.decode(ProcessInteractive.run("fabricare --for-platform=" + platform + " --separate-data=#JSON# release-exists").split("#JSON#")[1]);
		if (!Script.isNil(json)) {
			if (json.exists) {
				return;
			};
		};
		Console.writeLn(project);
	});
});
