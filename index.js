var fs = require('fs')


module.exports = () => {

	const defaultConfig = {
		output: 'file',
		file: 'jasmine-test-results.json',
		beautify: true,
		indentationLevel: 4 // used if beautify === true
	};

	var specResults = [];
	var masterResults = Object.create(null);

	class JasmineJsonTestReporter{
		constructor(instanceJasmine, optionalConfigInit) {
			this.jasmineJsonTestReporter = _.merge(
                {
                    jasmine: instanceJasmine,
                    config: defaultConfig,
                    data: {
                        curSpecCount: 0,
                        disabledCount: 0,
                        totalSpecsDefined: 0
                    }
                },
                {
                    config: optionalConfigInit
                }
            );

            const config = this.jasmineJsonTestReporter.config;
            const maxValueLen = Object.keys(config.statusDisplay)
                .reduce((currentLen, key) => config.statusDisplay[key].length > currentLen ? config.statusDisplay[key].length : currentLen, 0);

            config.statusPortionIndentStr = ' '.repeat(maxValueLen);

            Object.keys(config.statusDisplay)
                .forEach((key) => {
                    config.statusDisplayPadded[key] = rightPad(config.statusDisplay[key], config.statusPortionIndentStr);
			});
		}
	}

	this.suiteDone = function(suite) {
		suite.specs = specResults;
		masterResults[suite.id] = suite;
		specResults = [];
	};

	this.specDone = function(spec) {
		specResults.push(spec);
	};

	this.jasmineDone = function() {
		var resultsOutput = options.beautify ?
			JSON.stringify(masterResults, null, options.indentationLevel) :
			JSON.stringify(masterResults);
		
		if (options.file === 'file')
			fs.writeFileSync(options.file, resultsOutput);
		else if (options.file === 'screen')
			console.log(resultsOutput);
	};
};

function shallowMerge(obj1, obj2) {
	var mergedObj = {};

	Object.keys(obj1).forEach(function(key) {
		if (!obj2[key]) mergedObj[key] = obj1[key];
		else mergedObj[key] = obj2[key];
	});

	return mergedObj;
};

module.exports = reporter;