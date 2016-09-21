<?php
/**
 * Created by PhpStorm.
 * User: Manish
 * Date: 9/3/2016
 * Time: 9:00 PM
 */


require 'DbOperation.php';

$response = array();

$db = new DbOperation();

$result = $db->getLaptops();
$response['laptops'] = array();

while($row = mysqli_fetch_array($result)){

    $temp = array();


    $temp['id'] = $row['id'];
    $temp['modelname'] = $row['modelname'];
    $temp['ram'] = $row['ram'];
    $temp['os'] = $row['os'];
    $temp['price'] = $row['price'];
    $temp['screensize'] = $row['screensize'];
    $temp['brand'] = $row['brand'];

    array_push($response['laptops'],$temp);

}

echo json_encode($response);
