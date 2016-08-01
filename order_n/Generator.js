var Markov = require('./Markov');
var CantKnockTheHustle = require('../source/CantKnockTheHustle');
var DirtOffYourShoulder = require('../source/DirtOffYourShoulder');
var Encore = require('../source/Encore');
var GirlsGirlsGirls = require('../source/GirlsGirlsGirls');
var HeartOfTheCity = require('../source/HeartOfTheCity');
var InMyLifetime = require('../source/InMyLifetime');
var JiggaWhat = require('../source/JiggaWhat');
var ShowMeWhatYouGot = require('../source/ShowMeWhatYouGot');
var Problems = require('../source/99Problems');
var Takeover = require('../source/Takeover');


var markov = new Markov(2);

markov.ingest(CantKnockTheHustle);
markov.ingest(DirtOffYourShoulder);
markov.ingest(Encore);
markov.ingest(GirlsGirlsGirls);
markov.ingest(HeartOfTheCity);
markov.ingest(InMyLifetime);
markov.ingest(JiggaWhat);
markov.ingest(ShowMeWhatYouGot);
markov.ingest(Problems);
markov.ingest(Takeover);

var rap = markov.generate(100);
console.log(rap);