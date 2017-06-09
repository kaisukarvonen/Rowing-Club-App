<?php
require_once('/home/scocta5/bin/composer/vendor/autoload.php');

use Zend\Config\Factory;

$clubId = $_GET['clubId'];

$config = Factory::fromFile('config_rowing_club_db.php', true);

$servername=$config->get("database")->get("servername");
$dbusername=$config->get("database")->get("username");
$dbpassword=$config->get("database")->get("password");
$dbname=$config->get("database")->get("dbname");

try {

   $connection = new PDO("mysql:host=$servername;dbname=$dbname", $dbusername, $dbpassword);
   $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
   $stmt_user= $connection->prepare('SELECT id, username, firstname, lastname FROM User WHERE club_id=:clubId');
   $stmt_user->bindParam(':clubId', $clubId);

   $stmt_boat= $connection->prepare('SELECT id, name, capacity FROM Boat WHERE club_id=:clubId');
   $stmt_boat->bindParam(':clubId', $clubId);

   $stmt_user->execute();
   $stmt_boat->execute();

   $user_result =$stmt_user->fetchAll(PDO::FETCH_ASSOC);
   $boat_result =$stmt_boat->fetchAll(PDO::FETCH_ASSOC);
   
   $array=json_encode(array('Users' => $user_result , 'Boats' => $boat_result)); 
   echo $array;
 
} catch (PDOException $e) {
   header('HTTP/1.0 500 Internal Server Error');
}

?>