/*******************************************
 * Response class
 * Cyril Cecchinel, Matthieu Jimenez
 * Polytech'Nice-Sophia - 2013
 *******************************************/
 
function Response(){
	this.content = ""; // response content
};

Response.prototype.isReady = function(){
	return this.content != false;
};