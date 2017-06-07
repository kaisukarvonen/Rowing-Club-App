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

   SELECT id, km, date FROM Trip
   JOIN ?
   
} catch (PDOException $e) {
   header('HTTP/1.0 500 Internal Server Error');
}


?>