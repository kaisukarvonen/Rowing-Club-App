<?php
require_once('/home/scocta5/bin/composer/vendor/autoload.php');

use Zend\Config\Factory;

$tripId = $_POST['tripId'];

$config = Factory::fromFile('config_rowing_club_db.php', true);

$servername=$config->get("database")->get("servername");
$dbusername=$config->get("database")->get("username");
$dbpassword=$config->get("database")->get("password");
$dbname=$config->get("database")->get("dbname");


try {
  $connection = new PDO("mysql:host=$servername;dbname=$dbname", $dbusername, $dbpassword);
  $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $stmt_searchCoordinates = $connection->prepare('SELECT latitude, longitude FROM Trip_coordinates WHERE trip_id=:tripId');
  $stmt_searchCoordinates->bindParam(':tripId', $tripId);
  $stmt_searchCoordinates->execute();
  $searchResult = $stmt_searchCoordinates->fetchAll();
  
 
  $array=json_encode(array('Coordinates' => $searchResult)); 
  echo $array;
   
} catch (PDOException $e) {
   header('HTTP/1.0 500 Internal Server Error');
}


?>