<?php
require_once 'ThumbLib.inc.php';
include_once "connection.php";

$temp_file = $_FILES['transfer']['tmp_name'];
$file_name = explode(".", $_FILES['transfer']['name']);
$type = $_FILES['transfer']['type'];
if(!isset($_REQUEST['sender']) || !isset($_REQUEST['target'])){
    $sender = NULL;
    $target = NULL;
    $timestamp = NULL;
}
else{
    $sender = $_REQUEST['sender'];
    $target = $_REQUEST['target'];
    $timestamp = $_REQUEST['timestamp'];
}

$width = 800;
$height = 600;
$formatos = array("image/png", "image/jpeg", "image/gif", "text/plain", "application/pdf", "audio/mp3", "audio/wav",
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  "application/vnd.openxmlformats-officedocument.presentationml.presentation");

if(in_array($type, $formatos)){
    $response = array();
    $response['type'] = $type;
    
    //Files type IMAGE
    if($type == "image/png" || $type == "image/jpeg" || $type == "image/gif"){
        $type = "image/png";
        $dataImage = getimagesize($temp_file);
        if($dataImage[0] > $width || $dataImage[1] > $width){
            $thumb = PhpThumbFactory::create($temp_file);
            $thumb->resize($width, $height);
            $thumb->save($temp_file, "png");
        }
    }
    process($temp_file, $type, $sender, $target, $timestamp);
}
else {
    //Error en tipo de archivo
    $response['type'] = $type;
    $response['error'] = true;
    echo json_encode($response);
}

function process($file_temp, $type, $sender, $target,$timestamp){
    /*
    $bin = fopen($file_temp, 'r');
    $b64 = base64_encode(fread($bin, filesize($file_temp)));
    fclose($bin);
    */
    $id_file = save_file($sender, $target, $type);
    
    if($canvas != NULL){
        if($type == "image/png"){
            //Generar Thumbnail y devolver arreglo
            $thumb = PhpThumbFactory::create($file_temp);
            $thumb->resize(40,40);
            $thumb->save($file_temp, "png");

            $bin = fopen($file_temp, 'r');
            $thumbnail = base64_encode(fread($bin, filesize($file_temp)));        
            fclose($bin);
            $response['thumbnail'] = $thumbnail;
        }
    }
    
    $response['type'] = $type;
    $response['id_file'] = $id_file;
    $response['error'] = false;
    $response['timestamp'] = $timestamp;
    echo json_encode($response);
}

function save_file($sender, $target, $type){
    $date = date("Y-m-d");
    $typ = explode("/", $type);
    $id = md5(time().$sender.$target).".".$typ[1];
    if(move_uploaded_file($_FILES['transfer']['tmp_name'], "upload/" . $id)){
        return $id;
    }
    else{
        return $id."ERROR";
    }
    
    /*
    $qry= "INSERT INTO files(id_file, sender, target, date_sent, type_file, data, name_file) VALUES ('$id', '$sender', '$target', '$date', '$type', '$data', '$file_name')";
    if(mysql_query($qry)){
        return $id;
    }else{
        return "ERROR EN INSERT";
    }
    */
}

?>