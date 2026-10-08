// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022-2026 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

// library.js: forEachProject filters, release helpers

var testName = "02";
Script.include("test/test.common.js");

// --- forEachProject: --no-vendor / --only-vendor

global.projectList = {
	"01.first" : ["xyo-a", "vendor-b"],
	"02.second" : ["c", "vendor-d", "e"]
};

global.noVendor = false;
global.onlyVendor = false;
check("forEachProject all", forEachProjectNames().join(","), "xyo-a,vendor-b,c,vendor-d,e");

global.noVendor = true;
check("forEachProject no-vendor", forEachProjectNames().join(","), "xyo-a,c,e");

global.noVendor = false;
global.onlyVendor = true;
check("forEachProject only-vendor", forEachProjectNames().join(","), "vendor-b,vendor-d");

global.noVendor = true;
check("forEachProject no-vendor and only-vendor", forEachProjectNames().join(","), "");

global.noVendor = false;
global.onlyVendor = false;

// --- decodeSeparateData: output of "fabricare --separate-data=#JSON# release-exists"

var output = "- \x1B[32mxyo-a\x1B[0m: release-exists\r\r\n#JSON#\r\r\n{\r\n\t\"exists\": true,\r\n\t\"release\": [\r\n\t\t\"xyo.xyo-a.v1.0.0.test-platform.bin.zip\"\r\n\t]\r\n}\r\r\n";
var json = decodeSeparateData(output);
checkTrue("decodeSeparateData object", Script.isObject(json));
if (Script.isObject(json)) {
	check("decodeSeparateData exists", json.exists, true);
	check("decodeSeparateData release", json.release[0], "xyo.xyo-a.v1.0.0.test-platform.bin.zip");
};

check("decodeSeparateData undefined", decodeSeparateData(undefined), null);
check("decodeSeparateData no marker", decodeSeparateData("- xyo-a: release-exists\r\n"), null);
check("decodeSeparateData no json", decodeSeparateData("Error: Platform none not found!\r\n#JSON#\r\n"), null);
check("decodeSeparateData bad json", decodeSeparateData("#JSON#\r\n{ \"exists\": "), null);

// --- getReleasePlatform: the current platform without --for-platform

check("getReleasePlatform", getReleasePlatform(), "test-platform");

testDone();
