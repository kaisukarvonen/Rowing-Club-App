<?php
require_once('/home/scocta5/bin/composer/vendor/autoload.php');

use Zend\Config\Factory;

$tripId = $_GET['tripId'];

$config = Factory::fromFile('config_rowing_club_db.php', true);

$servername=$config->get("database")->get("servername");
$dbusername=$config->get("database")->get("username");
$dbpassword=$config->get("database")->get("password");
$dbname=$config->get("database")->get("dbname");


try {
  $connection = new PDO("mysql:host=$servername;dbname=$dbname", $dbusername, $dbpassword);
  $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $stmt_searchTripParticipants = $connection->prepare('SELECT firstname, lastname FROM User JOIN User_trip ON User_trip.user_id = User.id AND User_trip.trip_id=:tripId');
  $stmt_searchTripParticipants->bindParam(':tripId', $tripId);
  $stmt_searchTripParticipants->execute();
  $searchResult = $stmt_searchTripParticipants->fetchAll();
  
  $array=json_encode(array('TripParticipants' => $searchResult)); 
  echo $array;
   
} catch (PDOException $e) {
   header('HTTP/1.0 500 Internal Server Error');
   
}


?>