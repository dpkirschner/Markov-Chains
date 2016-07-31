var Markov = require('./Markov');

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

var markov = new Markov();
markov.ingest(source);
console.log(markov.generate(40));