<?php
//todo: 
//Create config file
//check for matching images and return the actual image

// Initialises the filename for our image.
// Final Variables:
// - $savedFile, made from $fileDir and $newFileName (generated)
// - $fileExt, extension of file - used to for validation and database storage (required?)
// -
$fileDir = "f/";
$fileName = basename($_FILES["fileUpload"]["name"]);
$fileExt = $_FILES['fileUpload']['type'];
$fileExt = explode("/", $fileExt)[1];
$newFileName = generate_name($fileName) . "." . $fileExt;
$savedFile = $fileDir . $newFileName;

$allowedFiles = array("jpg","jpeg","gif","png");


$conn = dbConn();

//validate file, ensure that it is an image (using cURL returns octet-type oh no)
if (!in_array($fileExt, $allowedFiles)) {
    die("Error with uploaded file");
    $conn->close();
}

if (move_uploaded_file($_FILES["fileUpload"]["tmp_name"], $savedFile)) {
    //if we can upload the file without any error, then upload and notify the user.
    //we use $_SERVER['SERVER_ADDR'] to make the software more portable.
    echo "<p>file available <a href=" . $_SERVER['SERVER_ADDR'] ."/" . $savedFile . ">here</a></p>\n";
    $imgHash = md5_file($savedFile);
    insertFile($conn, $fileName, $newFileName, $fileExt, $imgHash);
    $conn->close();

}

function generate_name($fileName) {
    $arrName = str_split($fileName);
    $newFileName = '';
    $nameArr = array_merge(range('a','z'), range('A','Z'), range(0,9), $arrName);
    //while unique stuff here, important to store all filenames in database hereon.
    for ( $i = 0; $i < 8; $i++ ) {
        $newFileName .= $nameArr[array_rand($nameArr)];
    }
    return $newFileName;
}

function dbConn() {
    //todo: move this to config file
    $servername = "localhost";
    $username = "root"; //yeah yeah
    $password = ""; //naughty
    $database = "upld";

    $conn = new mysqli($servername, $username, $password, $database);
    if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
    }
   return $conn; 
}

function insertFile($conn, $origFileName, $newName, $ext, $hash) {
    $curDate = date("Y-m-d");
    $insertStatement = $conn->prepare("INSERT INTO IMAGES (img_hash,img_origName,img_name,img_format,img_uplDate) VALUES (?,?,?,?,?)");
    $insertStatement->bind_param("sssss", $hash, $origFileName, $newName, $ext, $curDate);
    $insertStatement->execute();
    echo "\n\nDatabase successfully updated";
}

?>
