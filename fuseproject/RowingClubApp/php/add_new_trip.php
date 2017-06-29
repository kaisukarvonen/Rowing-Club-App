<?php
require_once('/home/scocta5/bin/composer/vendor/autoload.php');

use Zend\Config\Factory;

$boatId = $_GET['boatId'];
$km = $_GET['km'];
$str_coordinates = $_GET['coordinates'];
$array_coordinates = json_decode($str_coordinates, true);
$str_participants = $_GET['participants'];


$array_participants = json_decode($str_participants);
foreach ($array_participants as &$val) {
    $val = intval($val);
}
sort($array_participants);

$config = Factory::fromFile('config_rowing_club_db.php', true);

$servername=$config->get("database")->get("servername");
$dbusername=$config->get("database")->get("username");
$dbpassword=$config->get("database")->get("password");
$dbname=$config->get("database")->get("dbname");


try {

   $connection = new PDO("mysql:host=$servername;dbname=$dbname", $dbusername, $dbpassword);
   $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

   $tripAdded = false;

   $stmt_searchTrip = $connection->prepare('SELECT id FROM Trip WHERE date=CURDATE() AND boat_id=:boatId');
   $stmt_searchTrip->bindParam(':boatId', $boatId);
   $stmt_searchTrip->execute();
   $searchResult=$stmt_searchTrip->fetchAll();
   if (count($searchResult > 0)) {
      for($i =0; $i < count($searchResult); $i++) {
        $stmt_searchUserTrip = $connection->prepare('SELECT user_id FROM User_trip WHERE trip_id=:trip_id');
        $stmt_searchUserTrip->bindParam(':trip_id', $searchResult[$i]["id"]);
        $stmt_searchUserTrip->execute();
        $trip_userList=$stmt_searchUserTrip->fetchAll(PDO::FETCH_COLUMN, 0);
        sort($trip_userList);
        if (count($trip_userList) == count($array_participants) && $trip_userList == $array_participants) {
           $tripAdded = true;
           header('HTTP/1.0 400 Trip Already Added');
           //echo "already added";
           break;
        }
      }
   }

  if (!$tripAdded) {
     $stmt_addTrip= $connection->prepare('INSERT INTO Trip(km, boat_id, date) values (:km, :boatId, CURDATE())');
     $stmt_addTrip->bindParam(':km', $km);
     $stmt_addTrip->bindParam(':boatId', $boatId);
     $stmt_addTrip->execute();

     $trip_id = $connection->lastInsertId();
     
     $stmt_addUserTrip= $connection->prepare('INSERT INTO User_trip values (:user_id, :trip_id)');
     
     for($i =0; $i < count($array_participants); $i++) {
         $stmt_addUserTrip->bindParam(':user_id', $array_participants[$i]);
         $stmt_addUserTrip->bindParam(':trip_id', $trip_id);
         $stmt_addUserTrip->execute();
      }

     $stmt_addTripCoordinates= $connection->prepare('INSERT INTO Trip_coordinates(latitude,longitude,trip_id) values (:lat, :lon, :trip_id)');

     for($i =0; $i < count($array_coordinates); $i++) {
        $stmt_addTripCoordinates->bindParam(':lat', $array_coordinates[$i]["lat"]);
        $stmt_addTripCoordinates->bindParam(':lon', $array_coordinates[$i]["lon"]);
        $stmt_addTripCoordinates->bindParam(':trip_id', $trip_id);
        $stmt_addTripCoordinates->execute();
     }

    $stmt_addUserKm= $connection->prepare('UPDATE User SET all_kms=all_kms+:km WHERE id=:user_id');
    for($i =0; $i < count($array_participants); $i++) {
      $stmt_addUserKm->bindParam(':user_id', $array_participants[$i]);
      $stmt_addUserKm->bindParam(':km', $km);
      $stmt_addUserKm->execute();
    }
    
  }

 
} catch (PDOException $e) {
   header('HTTP/1.0 500 Internal Server Error');
   //echo $e->getMessage(). " ---- on line ".$e->getLine();
}


?>