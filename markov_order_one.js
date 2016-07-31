var _ = require('underscore');

var Node = function(name) {
	this.name = name;
	this.library = {};
	this.timesSeen = 0;
	this.builtIndices = [];
}
Node.prototype.see = function() {
	this.timesSeen++;
}
Node.prototype.buildIndices = function() {
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
Node.prototype.chain = function(word) {
	if(!this.library[word]) {
		this.library[word] = new Node(word);
	}

	this.library[word].timesSeen++;
};

var Markov = function(name) {
	this.name = name;
}
Markov.prototype = new Node();
Markov.prototype.ingest = function(source) {
	var words = source.split(" ");

	_.each(words, function(value, index, obj) {
		this.see();
		var normalized = this._normalize(value);
		if(!this.library[normalized]) {
			this.library[normalized] = new Node(normalized);
		}

		//tally this word
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
Markov.prototype._normalize = function(word) {
	return word
			.toLowerCase()
			//remove any whitespace
			.replace(/^\s+|\s+$/g, '');
}
Markov.prototype.generate = function(length) {
	var generatedText = "";
	var prevWord;
	// this.generate(1, selectedWord);
	//pick a word from the whole library to start us.
	//pick a word from that chain with length 1
	_.each(_.range(length), function(value, index, obj) {
		var nextWord = this._generateHelper(prevWord);
		generatedText += nextWord === "" ? nextWord : " " + nextWord;
		prevWord = nextWord;
	}, this);

	return generatedText;
}
Markov.prototype._generateHelper = function(word) {
	var pool = word ? this.library[word] : this;
	var selectedWord = this._randomWord(pool);
	return selectedWord;
}
Markov.prototype._randomWord = function(pool){
	var selection = Math.round(Math.random() * 100);
	var word = pool.builtIndices[selection];
	return word ? word : "";
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
//console.log(markov.library["grace"]);
console.log(markov.generate(40));

//console.log(node);