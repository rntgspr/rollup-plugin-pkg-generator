var fs = require("fs-extra");
var colors = require("colors");
var cwd = process.cwd();
const name = "rollup-plugin-pkg-generator";

var defaultPkg = {
	"name" : "NAME",
	"version" : "VERSION",
	"description" : "DESCRIPTION",
	"main" : "index.js",
	"module" : "MODULE_NAME.umd.js",
	"homepage" : "HOMEPAGE",
	"repository" : {
		"type" : "REPOSITORY_TYPE",
		"url" : "REPOSITORY_URL"
	},
	"typings" : "index.d.ts",
	"keywords" : [],
	"author" : "AUTHOR",
	"license" : "LICENSE",
	"peerDependencies" : []
};


function success(msg) {
	console.info('[' + name + '] ' +msg.green + "' (" + "\u2714".green + ")");
}

function fatal(msg, err) {
	console.error('[' + name + '] ' +msg.red + "' (" + "\u2718".red + ")");
	console.error();
	console.error("    " + err);
	process.exit(err.errno);
}


function hasKeys(object) {
	for (var prop in object) {
		if (object.hasOwnProperty(prop)) {
			return true;
		}
	}
	return false;
}

module.exports = function(options = {}) {
	const defaultOptions = {output: cwd+'/dist/', pkg:{}};
	options = Object.assign(defaultOptions, options);

	return {
		name : name,
		ongenerate : function(object) {

			var providedPkg = hasKeys(options.pkg);
			if (providedPkg) {
				success('using provided pkg definition: ');
				success(options.pkg);
			} else {
				success('using default pkg definition.');
				
				var mainPkg = require(cwd + '/package.json');
				if (!mainPkg) {
					fatal('could not find main package.json to populate template', {errno:1});
				} else {
					defaultPkg.name = mainPkg.name;
					defaultPkg.version = mainPkg.version;
					defaultPkg.description = mainPkg.description;
					defaultPkg.main = mainPkg.main;
					defaultPkg.module = mainPkg.module;
					defaultPkg.homepage = mainPkg.homepage;
					defaultPkg.repository = mainPkg.repository;
					defaultPkg.typings = mainPkg.typings;
					defaultPkg.keywords = mainPkg.keywords;
					defaultPkg.author = mainPkg.author;
					defaultPkg.license = mainPkg.license;
					defaultPkg.peerDependencies = mainPkg.dependencies;
				}
				
				var json = JSON.stringify(defaultPkg, null, 4);
				fs.writeFile(options.output + 'package.json', json, 'utf8', function(err){
					if (err) {
						fatal('failed to generate package.json', err);
					} else {
						success('generated package.json');
					}
				});
			}

		}
	}
};