
// Compute prime number
var PRIME_NUMBER = computePrimeNumber(2000);

//Create Player
var alicePlayer = new Player("Alice");

//create Global Variable
var stockage;
var ecards;
var resDeckObj;
var aliceCard;
var bobCard;
var mesCartes;

/** Connect with bob **/

// Prevent reusing an older session with bob
var quitObj = new Request("QUIT");
var resQuitObj = new Response();
sendToBob(quitObj, resQuitObj);

// Connect to bob and send prime number
var helloObj = new Request("HELLO", PRIME_NUMBER);
var resHelloObj = new Response();
sendToBob(helloObj, resHelloObj);

/** generating Key **/

//Compute Alice Key
var key=computeKey(PRIME_NUMBER);


/** document function **/

//Set correct attribute for input
$(document).ready(function() {
    $("#form1 input").attr({
        "max" : PRIME_NUMBER-1,
        "min" : 0,
        "value": 0
    });
} );

/**function call when user click random
 * it generate a unique random number for each card
 */
function random(){
    //get all input for the coding the cards
    var x= $("#form1 input").get()
    //Array of already chosen number
    var dejavu=new Array(16);
    //select random number
    for (var y=0; y< x.length; y++){
        var z=Math.floor(Math.random()*PRIME_NUMBER-1);
        while (dejavu.indexOf(z)!=-1 || z==-1){
            var z=Math.floor(Math.random()*PRIME_NUMBER-1);
        }
        dejavu.push(z);
        x[y].value=z;
    }

}

/**function call when user click triche
* it generate a sqare modulo random number for each ace
* and a non square modulo random number for every other cards
*/
function triche(){
    var x= $("#form1 input").get()
    var dejavu=new Array(16);
    for (var y=0; y< x.length; y++){
        if (y<4){
            var z=Math.floor(Math.random()*PRIME_NUMBER-1);
            while (dejavu.indexOf(z)!=-1 || test_sq(z,PRIME_NUMBER)!=1 || z==-1){
                var z=Math.floor(Math.random()*PRIME_NUMBER-1);
            }
        }
        else{
            var z=Math.floor(Math.random()*PRIME_NUMBER-1);
            while (dejavu.indexOf(z)!=-1 || test_sq(z,PRIME_NUMBER)==1 || z==-1){
                var z=Math.floor(Math.random()*PRIME_NUMBER-1);
                }
        }
        dejavu.push(z);
        x[y].value=z;
    }
}

/**
 * function call when user click on valider
 * verify that each card has a unique number
 * then call suite()
 */
function normal(){
   var x= $("#form1 input").get()
   var dejavu=new Array(16);
   stockage = new Array();
   var fini=true;
   for (var y=0; y< x.length; y++){
      var valu= x[y].value;
      var nom= (x[y]).getAttribute("name")

      if (dejavu.indexOf(valu)!=-1){
          alert("2 cartes sont encodé de la meme facon");
          fini=false;
          break;
      }
      else {
      dejavu.push(valu)
      var card= new Card(nom,valu);
      stockage.push(card);
      }
   }
   if (fini){
       suite();
   }

}
/**
 *  function use to send the card and their number to the web service
 *  and to refresh the page
 */
function suite(){
    var deckObj = new Request("RECEIVE_CARDS", stockage);
    resDeckObj = new Response();
    sendToBob(deckObj, resDeckObj)
    $("#page").empty();
    var p= "<div class\"starter-template\"> \
                <h1>Felicitations, les cartes ont bien ete encodees</h1>\
                <p class=\"lead\">Desormais, vous pouvez soit choisir les cartes aleatoirement,soit si vous avez triche les choisir a l'aide\
                des residus quadratiques</p>\
                <input type=\"button\" class=\"btn btn-lg btn-info\" value=\"normal!\" onclick=\"choixaleatoire()\">\
                <input type=\"button\" class=\"btn btn-lg btn-info\" value=\"J'ai triche!\" onclick=\"choixquadratique()\">\
            </div>"
    $("#page").append(p);

}
var shuffledCard;
/**
 * function called when user click on normal
 */
function choixaleatoire(){
    //Alice Card
    aliceCard= new Array;
    //Bob card
    bobCard= new Array;
    //Already seen Card
    var dejavu= new Array;
    //parse the response of the webserver
    ecards = JSON.parse(resDeckObj.content);
    shuffledCard=alicePlayer.shuffleCards(ecards);
    //pick random card for alice
    for (var i=0; i<5;i++){
        var card= randomPick(dejavu);
        dejavu.push(String(card));
        //crypt alice Card
        aliceCard.push(String(encrypt(card,key,PRIME_NUMBER)));
    }
    //pick random card for bob
    for (var i=0; i<5;i++){
        var card= randomPick(dejavu);
        dejavu.push(String(card));
        bobCard.push(String(card));
    }
    envoiMains()

}
/**
 * function called when user click on J'ai triche
 * function calcul the quadratic residue of every card and chose the four with a value of one for
 * Alice (4 aces)
 * then chose 1 random car for alice and 5 random for Bob
 */
function choixquadratique(){
    aliceCard= new Array;
    bobCard= new Array;
    var dejavu= new Array;
    ecards = JSON.parse(resDeckObj.content);
    shuffledCard=alicePlayer.shuffleCards(ecards);
    for (var i=0; i<shuffledCard.length;i++) {
        if (test_sq(shuffledCard[i],PRIME_NUMBER)==1){
            aliceCard.push(shuffledCard[i]);
            dejavu.push(String(shuffledCard[i]));
        }
    }
    for (var i=0; i<4;i++){
        var card=aliceCard[i];
        aliceCard[i]=String(encrypt(card,key,PRIME_NUMBER));
        }
    var card= randomPick(dejavu);
    dejavu.push(String(card));
    aliceCard.push(String(encrypt(card,key,PRIME_NUMBER)));

    for (var i=0; i<5;i++){
        var card= randomPick(dejavu);
        dejavu.push(String(card));
        bobCard.push(String(card));
    }
    envoiMains()
}
var resCardObj;
/**
 * Function called to send the hand to the webserver
 */
function envoiMains(){
    var parameter= [aliceCard,bobCard];
    var reqObj = new Request("RECEIVE_DECKS", parameter);
    resCardObj = new Response();
    sendToBob(reqObj,resCardObj);
    $("#page").empty();
    var p= "<div class\"starter-template\"> \
                <h1>Felicitations, les cartes ont bien envoyees</h1>\
                <p class=\"lead\">Cliquer pour decourvrir votre main</p>\
                <input type=\"button\" class=\"btn btn-lg btn-success\" value=\"je veux voir ma main!\" onclick=\"endGame()\">\
            </div>"
    $("#page").append(p);
}

function endGame(){
    if (resCardObj.content==false){
        alert("patience");
    }
    else{
    var x=JSON.parse(resCardObj.content);
    mesCartes=new Array();
    for (var y=0;y< x.length;y++){
      var m=decrypt(parseInt(x[y]),key,PRIME_NUMBER)
      for (var z=0;z<stockage.length;z++){
          if (stockage[z].cardEncode==m){
              mesCartes.push(stockage[z].nom);
          }
      }

    }
    $("#page").empty();
    var p= "<div class\"starter-template\"> \
                <h1>Felicitations, voici vos cartes</h1>";

        for (var z=0;z<5;z++){
            p+="<br/>";
            p+=mesCartes[z];
            p+="<br/>";
        }

        p+="<p class=\"lead\"></p>\
            </div>"
        $("#page").append(p);
}
}
function randomPick (dejavu){
    // Select a random card in cardsList
    var index = Math.floor(Math.random() * shuffledCard.length)
    while (dejavu.indexOf(shuffledCard[index])!=-1){
        var index = Math.floor(Math.random() * shuffledCard.length)
    }
    var card = shuffledCard[index];
    //shuffledCard.splice(index, 1);
    return parseInt(card);
}
