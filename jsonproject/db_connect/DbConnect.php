<?php

/**
 * Created by PhpStorm.
 * User: Manish
 * Date: 9/3/2016
 * Time: 5:36 PM
 */

class DbConnect
{


    private $con;

    function __construct()
    {
    }

    function connect(){


        include 'Constants.php';
        $this->con = new mysqli(DB_HOST,DB_USERNAME,DB_PASSWORD,DB_NAME);
        if(mysqli_connect_errno()){

            echo 'Failed to connect to mysql'.mysqli_connect_errno();
        }
        return $this->con;
    }

}
