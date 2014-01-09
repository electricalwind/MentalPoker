var gcd = function(x, y) {
    while (y != 0) {
        var z = x % y;
        x = y;
        y = z;
    }
    return x;
};

function computeKey(prime){
    var tmp;
    do {
        tmp = Math.floor(Math.random() * (prime - 1));
    }
    while (gcd(tmp, prime - 1) != 1 || (tmp == 0 || tmp == 1));
    return tmp;
};

/**
 bezout
 Recursive function which return (g,x,y) / px+qy=g where g = gcd(p,q).
 Ref :	 http://en.wikipedia.org/wiki/Modular_multiplicative_inverse#Extended_Euclidean_algorithm
 Return :
 Array of bezout coefficients
 */
var bezout = function(p,q)
{
    if (p==0) return [q,0,1];
    else
    {
        var result = bezout(q%p,p);
        var g = result[0];
        var y = result[1];
        var x = result[2];
        return [g, x-Math.floor(q/p)*y, y];
    }
};

/**
 invmod
 Inverse modulo of a mod q
 Input :
 a : (int) Number
 q : (int) Modulo
 Return :
 (int) Inv. Mod of a mod q
 */
var invmod = function(a,q)
{
    var result = bezout(a,q);
    var g = result[0];
    var x = result[1];
    var y = result[2];
    if (g !=1) return -1; else { var tmp = x%q; if (tmp < 0) return q + tmp; else return tmp; }

};

/**
 encrypt
 Encrypt data with a given key according SRA protocol
 Parameters :
 data : (int) Data to encrypt
 key : (int) Key used
 Return :
 (int) Encrypted data
 */
var encrypt = function(data,key,prime){
    return modpow(data,key,prime)//Math.pow(data,key)%prime;
};
/**
 decrypt
 Decrypt data with a given key according SRA protocol
 Parameters :
 data : (int) Data to decrypt
 key : (int) Key used for encyption
 Return :
 (int) decrypted data
 */
var decrypt = function(data,key,prime){
    //return Math.pow(data, invmod(key, prime-1))%prime;
    return modpow(data,invmod(key, prime-1),prime);
};
/**
 * Test if a number "a" is a squared modulo "q"
 * Parameters :
 *	a : (int) number to test
 *	q : (int) modulo
 *  Return :
 *	(int) 1 if a is a squared modulo
 */

var test_sq = function(a,q) {
    return modpow(a,(Math.floor((q-1)/2)%q),q);
};
/**
 * Suffle function
 * Src : http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 * Parameter :
 *	array : (array) Array to shuffle
 * Return :
 *	A shuffled array
 */
var shuffle = function(array){
    var currentIndex = array.length
        , temporaryValue
        , randomIndex
        ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

function modpow(b,e,m){
   var bi= int2bigInt(b,1,1);
   var ei= int2bigInt(e,1,1);
   var mi= int2bigInt(m,1,1);

   var x=powMod(bi,ei,mi);
   return parseInt(bigInt2str(x,10))
   //return mod(x,m);
}
