<?php
//header('Access-Control-Allow-Origin: *');


$servername="localhost";
$dbusername="root";
$dbpassword=""; 

$username=$_POST['username'];
$password= sha1($_POST['password']);

try {
   $connection = new PDO("mysql:host=$servername;dbname=rowing_club", $dbusername, $dbpassword);
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
}


?>