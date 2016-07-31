var _ = require('underscore');

var Markov = function() {
	this.library = new Set;
}

Markov.prototype.ingest = function(source) {
	var words = source.split(" ");

	_.each(words, function(value, index, obj) {
		var normalized = this._normalize(value);
		this.library.add(normalized);
	}, this);
}

Markov.prototype._normalize = function(word) {
	return word
			.toLowerCase()
			//trim both sides including line breaks
			.replace(/^\s+|\s+$/g, '');
}

//random pick words from the library until we reach the desired length
Markov.prototype.generate = function(length) {
	var arrayLibrary = Array.from(this.library);
	var generatedText = "";

	_.each(_.range(length), function() {
		var nextWord = arrayLibrary[_.random(arrayLibrary.length)]; 
		generatedText += nextWord === "" ? nextWord : " " + nextWord;
	}, this);

	return generatedText;
}

module.exports = Markov;