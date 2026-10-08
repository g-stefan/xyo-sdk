// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022-2026 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

// Tests of the xyo-sdk scripts, "fabricare --sdk test" runs the tests of all projects instead

messageAction("test");

Shell.mkdirRecursivelyIfNotExists("temp");

for (var k = 1; k <= 3; ++k) {
	var name = "test.0" + k;
	exitIfTest(Shell.execute("fabricare --run-script=test/" + name + ".js"), name);
};
