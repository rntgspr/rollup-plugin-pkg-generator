var fs = require("fs-extra");
var colors = require("colors");
var _ = require('lodash');
var cwd = process.cwd();
const name = "rollup-plugin-pkg-generator";

function info(msg) {
	console.info('[' + name + '] ' +msg);
}

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
	let pkg = {};

	return {
		name : name,
		ongenerate : function(object) {

			if (options.useMainPackage) {
				success('using main pkg definition for values.');
				var mainPkgFile = cwd + '/package.json';
				var mainPkg = require(mainPkgFile);
				if (!mainPkg) {
					fatal('could not find main package.json to populate template', {errno:1});
				} else {
					info('using values from ' + mainPkgFile);
					pkg = _.assign(pkg, mainPkg);
				}
			}
			
			pkg = _.assign(pkg, options.pkg);
			
			var file = options.output + 'package.json';
			fs.ensureFile(file).then(function(){
				fs.writeJson(file, pkg, {EOL: '\r\n', spaces: 2}, function(err){
					if (err) {
						fatal('failed to generate package.json', err);
					} else {
						success('generated package.json');
					}
				});
			}).catch(function(err){
				fatal('failed to create package.json', err);
			});
			

		}
	}
};