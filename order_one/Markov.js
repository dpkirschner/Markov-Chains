var _ = require('underscore');
var Word = require('./Word');

var Markov = function() {}

//Markov is really a subclass of a Word with some new features.
Markov.prototype = new Word();

//normalize each ingested word to ease matching
Markov.prototype._normalize = function(word) {
	return word
			.toLowerCase()
			//remove any whitespace
			.replace(/^\s+|\s+$/g, '');
}

//ingest the source material and prepare it for use
Markov.prototype.ingest = function(source) {
	var words = source.split(" ");

	_.each(words, function(value, index, obj) {
		//tally the current word in the top level library
		this.see();

		var normalized = this._normalize(value);
		if(!this.library[normalized]) {
			this.library[normalized] = new Word(normalized);
		}

		//tally the current word in the individual word library
		this.library[normalized].see();

		//special case the first word since that has no previous chain to attach
		if(index <= 0) {
			return;
		}

		//add the current word to the previous words chain
		this.library[this._normalize(words[index-1])].chain(normalized);
	}, this);

	this.buildIndices();
	_.each(this.library, function(element) {
		element.buildIndices();
	});
}

//choose a random word from the given pool using roulette wheel selection
//if the word doesn't exist (for instance if there are no valid selections) 
//return empty string
Markov.prototype._randomWord = function(pool){
	var selection = Math.round(Math.random() * 100);
	var word = pool.builtIndices[selection];
	return word ? word : "";
}

//generate a string of the required length according to the probability of
//each word being selected 
Markov.prototype.generate = function(length) {
	var generatedText = "";
	var prevWord;

	_.each(_.range(length), function(word, index, obj) {
		var pool = prevWord ? this.library[prevWord] : this;
		var nextWord = this._randomWord(pool);
		generatedText += nextWord === "" ? nextWord : " " + nextWord;
		prevWord = nextWord;
	}, this);

	return generatedText;
}

module.exports = Markov;