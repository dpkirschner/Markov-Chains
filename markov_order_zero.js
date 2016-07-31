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
			//remove any whitespace
			.replace(/^\s+|\s+$/g, '');
}

Markov.prototype.generate = function(length) {
	var arrayLibrary = Array.from(this.library);
	var generatedText = "";
	// this.generate(1, selectedWord);
	//pick a word from the whole library to start us.
	//pick a word from that chain with length 1
	_.each(_.range(length), function() {
		var nextWord = arrayLibrary[_.random(arrayLibrary.length)]; 
		generatedText += nextWord === "" ? nextWord : " " + nextWord;
	}, this);

	return generatedText;
}

// markov = new Markov();
// markov.ingest("This is a long this piece of text that should be split.");
var source = `To all the ladies in the place with style and grace 
Allow me to lace these lyrical duches in your bushes 
Who rock grooves and make moves with all the mommies? 
The back of the club, sippin Moet, is where you'll find me 
The back of the club, mackin hoes, my crew's behind me 
Mad question askin, blunt passin, music blastin 
But I just can't quit 
Because one of these honies Biggie gots ta creep with 
Sleep with, keep the ep a secret why not 
Why blow up my spot cause we both got hot 
Now check it, I got more Mack than Craig and in the bed 
Believe me sweety I got enough to feed the needy 
No need to be greedy I got mad friends with Benz's 
C-notes by the layers, true fuckin players 
Jump in the Rover and come over 
tell your friends jump in the GS3, I got the chronic by the tree`;

var markov = new Markov("BASE MARKOV");
markov.ingest(source);
console.log(markov.generate(40));

//console.log(node);