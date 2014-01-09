<?
/*******************************************
 * Web service for Mental Poker - Bob side
 * Cyril Cecchinel, Matthieu Jimenez
 * Polytech'Nice-Sophia - 2013
 *******************************************/

session_start();
require("functions.php");

header("Content-Type: text/plain");
// Get raw data from client
$json = $_POST['json_string'];

// Translate raw data into an array
$obj = json_decode($json, true);


// Dispatch AJAX Call to the right function
switch($obj["name"]){
	/*
	* HELLO prime_number
	*/
	case "HELLO":	// Connect and set prime number with server
		if (isset($_SESSION['prime']) && is_int($obj["parameters"])) // Check if user has already defined a prime number or bad number format
		{
			echo "Bad prime number or already connected with server";
			exit();
		}
		
		$_SESSION['prime'] = $obj["parameters"]; // Store prime number
		$_SESSION['key'] = generateKey(); // Compute Bob key
		echo 'OK';
		break;
	/*
	* RECEIVE_CARDS cards_array
	*/	
	case "RECEIVE_CARDS";
		if (!isset($_SESSION['prime'])){	// Check if prime number defined
			echo "Not prime number set";
			exit();
		}
		if ($obj["parameters"] == "" || !isset($obj["parameters"])){ // Check if a cards array is set
			echo "No cards received";
			exit();
		}
		$cardArray = array(1, count($obj["parameters"]));
		for ($i = 0; $i < count($obj["parameters"]) ; $i++)
			$cardArray[$i] = $obj["parameters"][$i]["cardEncode"]; // Create a local cards array
		
		// Shuffle cards
		shuffle($cardArray);
		
		
		// Encrypted cards
		$ce = array(1, count($cardArray));
		// TODO Ciphering and return
		for ($i = 0; $i<count($cardArray); $i++)
		{
			$ce[$i] = encrypt($cardArray[$i]);
		}
		echo json_encode($ce);
		break;
	case "RECEIVE_DECKS":
		if (!isset($_SESSION['prime'])){	// Check if prime number defined
			echo "Not prime number set";
			exit();
		}
		if ($obj["parameters"] == "" || !isset($obj["parameters"])){ // Check if a cards array is set
			echo "No cards received";
			exit();
		}
		
		$aliceDeck = $obj["parameters"][0];

		$bobDeck = $obj["parameters"][1];

		$aliceDeckDecrypt = array(1, count($aliceDeck)); ;
		$bobDeckDecrypt = array(1, count($bobDeck));

		// Decrypt poker hands
		for ($i= 0; $i<count($aliceDeck); $i++)
			$aliceDeckDecrypt[$i] = decrypt($aliceDeck[$i]);
        echo json_encode($aliceDeckDecrypt);

		for ($i= 0; $i<count($bobDeck); $i++)
			$bobDeckDecrypt[$i] = decrypt($bobDeck[$i]);
	
		// Send to Alice her decrypted hand
		//echo json_encode($aliceDeckDecrypt);

		break;
	case "QUIT":
		session_destroy();
		echo "OK";
		break;
	case "TEST":
		/* DO NOTHING */
		break;
	default:
		echo "Bad request";
}
?>