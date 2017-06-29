<?php
require_once('/home/scocta5/bin/composer/vendor/autoload.php');

use Zend\Config\Factory;

$userId = $_GET['userId'];

$config = Factory::fromFile('config_rowing_club_db.php', true);

$servername=$config->get("database")->get("servername");
$dbusername=$config->get("database")->get("username");
$dbpassword=$config->get("database")->get("password");
$dbname=$config->get("database")->get("dbname");


try {
  $connection = new PDO("mysql:host=$servername;dbname=$dbname", $dbusername, $dbpassword);
  $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $stmt_searchUserTrips = $connection->prepare('SELECT Trip.id, Trip.km, DATE_FORMAT(Trip.date,"%d.%m.%Y") as fdate, Boat.name as boat_name FROM Trip
  JOIN User_trip ON Trip.id = User_trip.trip_id AND User_trip.user_id=:userId JOIN Boat ON Trip.boat_id= Boat.id ORDER BY Trip.date DESC');
  $stmt_searchUserTrips->bindParam(':userId', $userId);
  $stmt_searchUserTrips->execute();
  $searchResult = $stmt_searchUserTrips->fetchAll();
  
  $array=json_encode(array('Trips' => $searchResult)); 
  echo $array;
   
} catch (PDOException $e) {
   header('HTTP/1.0 500 Internal Server Error');
}


?>