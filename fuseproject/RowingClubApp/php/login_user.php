<?php
require_once('/home/scocta5/bin/composer/vendor/autoload.php');

use Zend\Config\Factory;

/*$username=$_POST['username'];
$password= sha1($_POST['password']);
*/
$json = file_get_contents('php://input');
$obj = json_decode($json);
echo "x ",$obj.username;


/*$config = Factory::fromFile('config_rowing_club_db.php', true);

$servername=$config->get("database")->get("servername");
$dbusername=$config->get("database")->get("username");
$dbpassword=$config->get("database")->get("password");
$dbname=$config->get("database")->get("dbname");




try {
   $connection = new PDO("mysql:host=$servername;dbname=$dbname", $dbusername, $dbpassword);
   $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
   $stmt= $connection->prepare('SELECT id, username FROM User WHERE username= :username AND password= :password');
   $stmt->bindParam(':username', $username);
   $stmt->bindParam(':password', $password); 
   $stmt->execute();
   $result=$stmt->fetch();
   
   if ($result) {
     echo json_encode($result);
   } else {
     header('HTTP/1.0 401 Unauthorized');
   }
   
} catch (PDOException $e) {
   header('HTTP/1.0 500 Internal Server Error');
}*/


?>