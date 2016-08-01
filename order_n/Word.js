var _ = require('underscore');

var Word = function(name) {
	this.name = name;
	//because I'm lazy this library is technically full of Word objects.
	//really all we need from it are some counters.
	this.library = {};
	this.timesSeen = 0;
	this.builtIndices = [];
}

//keep track of the total number of times this word has been seen
Word.prototype.see = function() {
	this.timesSeen++;
}

//we use roulette wheel selection to choose words with the appropriate
//probability. This method precomputes indices for this to save time later.
Word.prototype.buildIndices = function() {
	var current = 0;

	_.each(this.library, function(word, key, obj) {
		//figure out the percentage this word is chained after its parent
		//and normalize to 2 decimal places;
		var spots = Math.round((word.timesSeen / this.timesSeen) * 100);
		_.each(_.range(spots), function(index) {
			this.builtIndices[current] = word.name;
			current++;
		}, this);
	}, this);

	//fill the array to length 100 to account for any rounding errors caused earlier
	var lastWord = this.builtIndices[current - 1];
	while(current <= 99) {
		this.builtIndices[current] = lastWord;
		current++;
	}
};

Word.prototype.chain = function(word) {
	if(!this.library[word]) {
		this.library[word] = new Word(word);
	}

	this.library[word].timesSeen++;
};

module.exports = Word;