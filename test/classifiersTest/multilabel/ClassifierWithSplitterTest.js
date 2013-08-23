/**
 * a unit-test for multi-label classifier with input-splitter (sentence splitter)
 * 
 * @author Erel Segal-Halevi
 * @since 2013-08
 */

var should = require('should');
var classifiers = require('../../../classifiers');
var FeaturesUnit = require('../../../features');

describe('baseline - classifier without a splitter', function() {
	it('should not classify long sentencs', function() {
		var classifier = new classifiers.EnhancedClassifier({
			classifierType:   classifiers.multilabel.BinaryRelevance,
			classifierOptions: {
				binaryClassifierType: classifiers.Winnow,
				binaryClassifierOptions: {
					retrain_count: 3
				}
			},
			featureExtractor: FeaturesUnit.WordsFromText(1),
			inputSplitter: null,
		});
		
		classifier.trainBatch([
		               		{input: "I want aa", output: 'A'},      // train on single class
		               		{input: "I want bb", output: 'B'},    // train on array with single class (same effect)
		               		{input: "I want cc", output: 'C'},// train on structured class, that will be stringified to "{C:c}".
		               	]);
		
		classifier.classify("I want aa").should.eql(['A']);
		classifier.classify("I want bb").should.eql(['B']);
		classifier.classify("I want cc").should.eql(['C']);
		classifier.classify("I want aa, I want bb, and I want cc").should.eql(['A','B']);
	});
})

describe('classifier with a splitter', function() {
	it('should classify long sentencs', function() {
		var classifier = new classifiers.EnhancedClassifier({
			classifierType:   classifiers.multilabel.BinaryRelevance,
			classifierOptions: {
				binaryClassifierType: classifiers.Winnow,
				binaryClassifierOptions: {
					retrain_count: 3
				}
			},
			featureExtractor: FeaturesUnit.WordsFromText(1),
			inputSplitter: FeaturesUnit.RegexpSplitter(/[.,;?!]|and/i),
		});
		
		classifier.trainBatch([
		               		{input: "I want aa", output: 'A'},      // train on single class
		               		{input: "I want bb", output: 'B'},    // train on array with single class (same effect)
		               		{input: "I want cc", output: 'C'},// train on structured class, that will be stringified to "{C:c}".
		               	]);
		
		classifier.classify("I want aa").should.eql(['A']);
		classifier.classify("I want bb").should.eql(['B']);
		classifier.classify("I want cc").should.eql(['C']);
		classifier.classify("I want aa, I want bb, and I want cc").should.eql(['A','B','C']);
	});
})
