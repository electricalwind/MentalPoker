/*******************************************
 * Player class
 * Cyril Cecchinel, Matthieu Jimenez
 * Polytech'Nice-Sophia - 2013
 *******************************************/
 
function Player(name){
	this.name = name; 
	this.myCards = new Array();
};

Player.prototype.shuffleCards = function(cardsArray){
    for(var j, x, i = cardsArray.length; i; j = Math.floor(Math.random() * i), x = cardsArray[--i], cardsArray[i] = cardsArray[j], cardsArray[j] = x);
	return cardsArray;
}

Player.prototype.setCards = function(cardsArray){
	this.myCards = cardsArray;
}

Player.prototype.randomPick = function(cardsList){
	// Select a random card in cardsList
	var index = Math.floor(Math.random() * cardsList.length)
	var card = cardsList[index];
	cardsList.splice(index, 1);
    return card
}
