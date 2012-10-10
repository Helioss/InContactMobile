<?php
include_once "connection.php";
session_start();
//if(!isset($_SESSION["file"])){
if(isset($_REQUEST['id_file'])){
    $id_file = $_REQUEST['id_file'];
    //$qry = "SELECT data, name_file, type_file FROM files WHERE target='$jid' AND id_file='$id_file' ";
    $qry = "SELECT data, name_file, type_file FROM files WHERE id_file='$id_file' ";
    $qryR = mysql_query($qry);

    if(mysql_num_rows($qryR) > 0){
        $response['error'] = FALSE;
        while($data = mysql_fetch_array($qryR))
        {
            $fileBin = $data[0];
            $fileName = $data[1];
            $fileType = explode("/", $data[2]);
        }
        $_SESSION["file"] = $fileBin;
        $_SESSION["type"] = $fileType[1];
        $_SESSION["name_file"] = $fileName;
        //echo "Se subió a sesión, $fileType[1], $fileName[0]";
        if($fileType[0]==="image"){
            echo $fileBin;
        }else{
            echo "Se subió a sesión, $fileType[1], $fileName[0]";
        }
    }else{
        echo "ERROR";
    }
}else {
    $fileBin = $_SESSION["file"];
    $fileType = ($_SESSION["type"] == "plain" ? "txt" : $_SESSION["type"]);
    $fileName = $_SESSION["name_file"];
    
    $size = strlen($fileBin);
    header("Content-Type: application/force-download");
    header('Content-Type: application/octet-stream');
    header("Content-Type: application/download");
    header("Content-Disposition: attachment; filename=$fileName.$fileType");
    header('Content-Length: '. $size);
    unset($_SESSION["file"]);
    unset($_SESSION["type"]);
    unset($_SESSION["name_file"]);
    session_destroy();
    echo base64_decode($fileBin);
}
//echo json_encode($response);

/*
session_start();
if(!isset($_SESSION["file"])){
    $file = $_REQUEST['data64'];
    $type = explode("/", $_REQUEST['type']);
    $file = base64_decode($file);
    $_SESSION["file"] = $file;
    $_SESSION["type"] = $type[1];
    echo "Se subió a sesión";
}
else{ 
    $file = $_SESSION["file"];
    $type = ($_SESSION["type"] == "plain" ? "txt" : $_SESSION["type"]);
    
    $size = strlen($file); 
    header("Content-Type: application/force-download");
    header('Content-Type: application/octet-stream'); 
    header("Content-Type: application/download"); 
    header("Content-Disposition: attachment; filename=file.$type"); 
    header('Content-Length: '. $size);
    unset($_SESSION["file"]);
    session_destroy();
    echo $file;
}
*/
?>