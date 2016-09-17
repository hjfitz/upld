<?php

$fileDir = "f/";
$savedFile = $fileDir . basename($_FILES["fileUpload"]["name"]);
$uploadOk = 1;

if (move_uploaded_file($_FILES["fileUpload"]["tmp_name"], $savedFile)) {
    echo "file available at localhost/$savedFile";
}

?>
