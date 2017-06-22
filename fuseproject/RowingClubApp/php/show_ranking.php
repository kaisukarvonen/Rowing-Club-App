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

   $tripAdded = false;

   $stmt_searchUsers = $connection->prepare('SELECT firstname, lastname, all_kms FROM User WHERE club_id=:clubId ORDER BY all_kms DESC');
   $stmt_searchUsers->bindParam(':clubId', $clubId);
   $stmt_searchUsers->execute();
   $searchResult=$stmt_searchUsers->fetchAll();

  $array=json_encode(array('UserList' => $searchResult)); 
  echo $array;
 
} catch (PDOException $e) {
   header('HTTP/1.0 500 Internal Server Error');
   //echo $e->getMessage(). " ---- on line ".$e->getLine();
}


?>