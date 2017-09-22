var fs = require("fs-extra");
var colors = require("colors");
var _ = require('lodash');
var cwd = process.cwd();
const name = "rollup-plugin-pkg-generator";

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
	const defaultOptions = {output: cwd+'/dist/', pkg:{}, useMainPackage: true};
	options = _.assign(defaultOptions, options);

	return {
		name : name,
		ongenerate : function(object) {

			if (!options.useMainPackage) {
				success('using provided pkg definition: ');
				success(options.pkg);
			} else {
				success('using main pkg definition for values.');
				
				var mainPkg = require(cwd + '/package.json');
				if (!mainPkg) {
					fatal('could not find main package.json to populate template', {errno:1});
				} else {
					options.pkg.name = options.pkg.name || mainPkg.name;
					options.pkg.version = options.pkg.version || mainPkg.version;
					options.pkg.description = options.pkg.description || mainPkg.description;
					options.pkg.main = options.pkg.main || mainPkg.main;
					options.pkg.module = options.pkg.module || mainPkg.module;
					options.pkg.homepage = options.pkg.homepage || mainPkg.homepage;
					options.pkg.repository = options.pkg.repository || mainPkg.repository;
					options.pkg.typings = options.pkg.typings || mainPkg.typings;
					options.pkg.keywords = options.pkg.keywords || mainPkg.keywords;
					options.pkg.author = options.pkg.author || mainPkg.author;
					options.pkg.license = options.pkg.license || mainPkg.license;
					options.pkg.peerDependencies = options.pkg.peerDependencies || mainPkg.dependencies;
				}
			}
			
			
			var json = JSON.stringify(options.pkg, null, 4);
			fs.writeFile(options.output + 'package.json', json, 'utf8', function(err){
				if (err) {
					fatal('failed to generate package.json', err);
				} else {
					success('generated package.json');
				}
			});

		}
	}
};