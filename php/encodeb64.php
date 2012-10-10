<?php
$img_src = $_FILES["file"]["tmp_name"];
$jsondata = array();
$imgbinary = fread(fopen($img_src, "r"), filesize($img_src));
$jsondata['img_b64'] = base64_encode($imgbinary);
echo json_encode($jsondata);
?>
