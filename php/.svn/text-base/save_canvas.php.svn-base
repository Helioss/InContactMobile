<?php
include_once 'config.php';
$canvasImg = $_REQUEST['transfer'];
$b64 = explode(",", $canvasImg);
$unencodedData=base64_decode($b64[1]);
//
$idFile = md5(time().$unencodedData);
if(!file_exists("upload/" . $idFile . ".png")){
    //Guardar en servidor
    $fp = fopen("upload/$idFile.png", 'wb');
    fwrite($fp, $unencodedData);
    fclose($fp);
    $response['canvasDone'] = UPLOADS . "upload/" . $idFile . ".png";
    echo json_encode($response);
}
?>
