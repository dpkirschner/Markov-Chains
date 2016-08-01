var _ = require('underscore');
var Word = require('./Word');

var Markov = function(chainLength) {
	this.chainLength = chainLength;
}

//Markov is really a subclass of a Word with some new features.
Markov.prototype = new Word();

//normalize each ingested word to ease matching
Markov.prototype._normalize = function(word) {
	return word
			.toLowerCase()
			//remove any whitespace
			.replace(/^\s+|\s+$/g, '')
			.replace(/[\W_]+/g, '');
}

//ingest the source material and prepare it for use
Markov.prototype.ingest = function(source) {
	var words = source.split(" ");
	var currentChain = [];

	_.each(words, function(word, index, obj) {
		//tally the current word in the top level library
		this.see();

		var normalized = this._normalize(word);

		//if the chain is the wrong length add the link and return
		if(currentChain.length < this.chainLength) {
			currentChain.push(normalized);
			return;
		}

		//insert the chain as key and the current word as value
		var keyChain = currentChain.toString();
		if(!this.library[keyChain]) {
			this.library[keyChain] = new Word(keyChain);
		}

		//create the new key the previous key should be chained to
		currentChain.shift();		
		currentChain.push(normalized);

		this.library[keyChain].see();
		this.library[keyChain].chain(currentChain.toString());
	}, this);

	//catch the last chain which signals the end of the source
	if(!this.library[currentChain.toString()]) {
		this.library[currentChain.toString()] = new Word(currentChain.toString());
	}

	this.buildIndices();
	_.each(this.library, function(element) {
		element.buildIndices();
	});
}

//choose a random word from the given pool using roulette wheel selection
//if the word doesn't exist (for instance if there are no valid selections) 
//return empty string
Markov.prototype._randomKey = function(pool){
	var selection = Math.round(Math.random() * 100);
	var key = pool.builtIndices[selection];
	return key ? key : "";
}

//generate a string of the required length according to the probability of
//each word being selected 
Markov.prototype.generate = function(length) {
	var generatedText = "";
	var prevKey;

	_.each(_.range(length), function(index) {
		var pool = prevKey ? this.library[prevKey] : this;
		var nextKey = this._randomKey(pool);
		var nextWord = nextKey ? nextKey.substring(nextKey.lastIndexOf(',') + 1) : "";

		//if there are no valid possibilities we begin a new chain using the base library.
		//we could let the loop do this itself, but we would end up shorting the length of the final
		//string by the number of new chains created so force it here.
		// while(!nextWord) {
		// 	console.log(nextWord, nextKey, pool);
		// 	nextKey = this._randomKey(this);
		// 	nextWord = nextKey ? nextKey.substring(nextKey.lastIndexOf(',') + 1) : "";
		// }
		
		generatedText += nextWord === "" ? nextWord : " " + nextWord;
		generatedText += index !== 0 && index % 10 === 0 ? "\n" : "";
		prevKey = nextKey;
	}, this);

	return generatedText;
}

module.exports = Markov;