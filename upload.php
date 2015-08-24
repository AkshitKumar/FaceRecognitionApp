<?php
 
define('UPLOAD_DIR', 'images/');
$name = $_POST['name'];
$img = $_POST['image'];
$img = str_replace('data:image/png;base64,','', $img);
$img = str_replace(' ', '+', $img);
$data = base64_decode($img);
$file = UPLOAD_DIR . $name . '.png';
$success = file_put_contents($file, $data)

?>