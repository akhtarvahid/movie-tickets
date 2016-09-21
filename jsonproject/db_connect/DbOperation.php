<?php
/**
 * Created by PhpStorm.
 * User: Manish
 * Date: 9/3/2016
 * Time: 5:40 PM
 */
class DbOperation
{


private  $con;

    function __construct()
    {
        require_once 'DbConnect.php';
        $db =new DbConnect();
        $this->con = $db->connect();
    }




    public function getLaptops(){

        $stmt = $this->con->prepare("SELECT * FROM laptop ");
        $stmt->execute();
        $result = $stmt->get_result();
        return $result;
    }

}
