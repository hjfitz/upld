<?php

// define the folder for the file to be saved to, and the name that it should be given
$fileDir = "f/";
$fileName = basename($_FILES["fileUpload"]["name"]);
$fileExt = "." . explode(".", $fileName)[1];
$savedFile = $fileDir . generate_name($fileName) . $fileExt;

if (move_uploaded_file($_FILES["fileUpload"]["tmp_name"], $savedFile)) {
    //if we can upload the file without any error, then upload and notify the user.
    //we use $_SERVER['SERVER_ADDR'] to make the software more portable.
    echo "file available at " . $_SERVER['SERVER_ADDR'] ."/" . $savedFile;
}

//echo "hash of file is: " . md5_file($savedFile); 
//

function generate_name($fileName) {
    $arrName = str_split($name);
    $newFileName = '';
    $nameArr = array_merge(range('a','z'), range('A','Z'), range(0,9), $arrName);
    //while unique stuff here, important to store all filenames in database hereon.
    for ( $i = 0; $i < 8; $i++ ) {
        $newFileName .= $nameArr[array_rand($nameArr)];
    }
    return $newFileName;
}
?>
