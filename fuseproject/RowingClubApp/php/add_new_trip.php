<?php
require_once('/home/scocta5/bin/composer/vendor/autoload.php');

use Zend\Config\Factory;

$boatId = $_GET['boatId'];
$km = $_GET['km'];
$str_coordinates = $_GET['coordinates'];
$array_coordinates = json_decode($str_coordinates);
$str_participants = $_GET['participants'];


$array_participants = json_decode($str_participants);
foreach ($array_participants as &$val) {
    $val = intval($val);
}

$config = Factory::fromFile('config_rowing_club_db.php', true);

$servername=$config->get("database")->get("servername");
$dbusername=$config->get("database")->get("username");
$dbpassword=$config->get("database")->get("password");
$dbname=$config->get("database")->get("dbname");


var_dump($array_coordinates);




try {

   $connection = new PDO("mysql:host=$servername;dbname=$dbname", $dbusername, $dbpassword);
   $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
   $stmt_addTrip= $connection->prepare('INSERT INTO Trip(km, boat_id) values (:km, :boatId)');
   $stmt_addTrip->bindParam(':km', $km);
   $stmt_addTrip->bindParam(':boatId', $boatId);
   $stmt_addTrip->execute();

   $trip_id = $connection->lastInsertId();
   
   $stmt_addUserTrip= $connection->prepare('INSERT INTO User_trip values (:user_id, '+$trip_id+')');
   foreach ($array_participants as $val) {
       $stmt_addUserTrip->bindParam(':user_id', $val);
       $stmt_addUserTrip->execute();
   }

   $stmt_addTripCoordinates= $connection->prepare('INSERT INTO Trip_coordinates(latitude,longitude,trip_id) values (:lat, :lon, '+$trip_id+')');

   foreach ($array_coordinates as $key => $val) {
       //$stmt_addUserTrip->bindParam(':lat', $val);
       //$stmt_addUserTrip->bindParam(':lon', $val);
       $stmt_addUserTrip->execute();
   }



   
   if ($user_result && $boat_result) {
      $array=json_encode(array('Users' => $user_result , 'Boats' => $boat_result)); 
      echo $array;
   } else {
      header('HTTP/1.0 400 Bad Request');
   }

 
} catch (PDOException $e) {
   header('HTTP/1.0 500 Internal Server Error');
}


?>