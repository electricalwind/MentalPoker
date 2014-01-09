<?
/*******************************************
 * Server side functions
 * Cyril Cecchinel, Matthieu Jimenez
 * Polytech'Nice-Sophia - 2013
 *******************************************/
 
 function shuffleCards($cardsArray){
	 return "TODO";
 }
 
 /**
 * Encrypt value according SRA Protocol
 */
 function encrypt($value)
 {
	 // Convert values to bingint
	 $key = intval($_SESSION['key']);
	 $gmp_key = gmp_init($key);
	 $gmp_prime = gmp_init($_SESSION['prime']);
	 $gmp_value = gmp_init($value);
	 
	 // Compute encryption and return result
	 return gmp_strval(gmp_mod(gmp_pow($gmp_value, $key), $gmp_prime));
 }
 
 /**
 * Decrypt value according SRA protocol
 */
 function decrypt($value)
 {
	 // Convert values to bigint
	 $gmp_key = gmp_init(intval($_SESSION['key']));
	 $gmp_prime = gmp_init($_SESSION['prime']);
	 $gmp_exp = gmp_sub($gmp_prime, gmp_init("1"));
	 $gmp_value = gmp_init($value);
	 
	 // Compute Modular exponentiation 
	 $gmp_pow_result = gmp_pow($gmp_value, gmp_intval(gmp_invert($gmp_key, $gmp_exp)));
	 
	 // Compute modulo and return result
	 return gmp_strval(gmp_mod($gmp_pow_result, $gmp_prime));
 }

 /**
 Generate a key for encryption/decryption
 */ 
 function generateKey()
 {
	 $max = intval($_SESSION['prime'] - 1);
	 do{
		 $tmp = rand(2, $max);
	 }
	 while (gmp_intval(gmp_gcd((string) $tmp, (string) ($_SESSION['prime'] - 1))) != 1);
	
	 return $tmp;
 }

 ?>