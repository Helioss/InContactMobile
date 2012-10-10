<?php
require_once 'ThumbLib.inc.php';
require_once 'config.php';
$upload = "upload/";
if($_FILES["file"]["error"] > 0){
    echo "Error: " . $_FILES["file"]["error"] . "<br />";
}else{
    $temp_file = $_FILES["file"]["tmp_name"];
    $type = $_FILES['file']['type'];
    $fileType = "";
    $from = $_REQUEST['from'];
    $to = $_REQUEST['to'];
    $timemoment = $_REQUEST['timemoment'];
    $ext = explode("/",$type);
    $storeName = "IC_" . date('Ymd') . "_" . $timemoment . "." . $ext[1];
    $id = "";
    $response = array();
    if($type == "image/png" || $type == "image/jpeg" || $type == "image/gif"){
        $thumb = PhpThumbFactory::create($temp_file);
        $thumb->resize(800, 600);
        $thumb->save($temp_file, "png");
    }
    if(file_exists($upload . $_FILES["file"]["name"])){
        //echo $upload . $_FILES["file"]["name"];
    }else{
        if(move_uploaded_file($_FILES["file"]["tmp_name"], $upload . $storeName)){
            if($type == "image/png" || $type == "image/jpeg" || $type == "image/jpg" || $type == "image/gif"){
                $fileType = "image";
                $origen = $upload . $storeName;
                $destino = $upload . "min/" . $storeName;
                if(copy($origen, $destino)){
                    $thumb = PhpThumbFactory::create($destino);
                    if($_REQUEST['send'] == "avatar"){
                        $thumb->adaptiveResize(65,65);
                        $thumb->save($destino, "png");
                        $imgbinary = fread(fopen($destino, "r"), filesize($destino));
                        $response['img_b64'] = base64_encode($imgbinary);
                        $response['sha1'] = sha1($imgbinary);
                    }else{
                        $thumb->resize(65, 65);
                        $thumb->save($destino, "png");
                    }
                    $response['thumbnail'] = UPLOADS . $upload . "min/" . $storeName;
                }
            }else if($type == "video/m4v" || $type == "video/3gpp"){
                $fileType = "video";
                $response['thumbnail'] = "images/video.png";
            }else if($type == "audio/3gpp" || $type == "audio/amr"){
                $fileType = "audio";
                $response['thumbnail'] = "images/audio.png";
            }
            //echo $upload . $_FILES["file"]["name"];
        }
    }
    $response['type'] = $fileType;
    $response['url'] = UPLOADS . $upload . $storeName;
    $response['from'] = $from;
    $response['to'] = $to;
    echo json_encode($response);
    
}
?>
