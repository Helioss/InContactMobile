<?php
$srv="localhost";
$usuario="root";
$contrasena="admin";
$bd="transferencias";
$conexion = @mysql_connect($srv,$usuario,$contrasena) or die ('Query failed: ' . mysql_error() . "$sql");
mysql_select_db($bd,$conexion);
?>