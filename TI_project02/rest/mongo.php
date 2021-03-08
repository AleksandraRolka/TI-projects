<?php
 
//require 'vendor/autoload.php' ;
 
class db 
{
	private $user = "8rolka" ;
	private $pass = "pass8rolka";
	private $host = "172.20.44.25";
	private $base = "8rolka";
	private $usersCollectionName = "users";
	private $sessionCollectionName = "session";
	private $surveyCollectionName = "survey";
	private $usersColl;
	private $sessionColl;
	private $surveyColl;
	private $conn;
	private $dbase;
 
 
 
	function __construct()
	{
		$this->conn = new MongoDB\Client("mongodb://{$this->user}:{$this->pass}@{$this->host}/{$this->base}"); 

		$this->usersColl	 = $this->conn->{$this->base}->{$this->usersCollectionName};
		$this->sessionColl = $this->conn->{$this->base}->{$this->sessionCollectionName};
		$this->surveyColl	 = $this->conn->{$this->base}->{$this->surveyCollectionName}; 
	}
 
 
	function survey($data)
	{
	  $res = $this->surveyColl->insertOne($data) ;
	  return $res;
	}
	
	
	function getdata()
	{
		$cursor = $this->surveyColl->find();
		$table = iterator_to_array($cursor);
		return $table ;
	}
 
 
	function login($user)
	{
		$login = $user['login'];
		$pass = $user['pass'];
		$tmp =	$this->usersColl->findOne(array("login" => $login, "pass" => $pass));
		if($tmp != null)
		{
			$sess_id = md5(uniqid($login, true));
			$start_time = date('Y-m-d H:i:s', time());
			$res = $this->sessionColl->insertOne(array("sessionID" => $sess_id, "start" => $start_time));
		}
		return $sess_id;
	}


	function logout($sess)
	{
		$tmp =	$this->sessionColl->findOne(array('sessionID' => $sess));
		if($tmp != null)
		{
			$this->sessionColl->deleteOne(array('sessionID' => $sess));
		}
		else
			return false;
		return true;
	}


	function register($user)
	{	
		$tmp =	$this->usersColl->findOne(array("login" => $user['login']));
		if($tmp == null)
			$res = $this->usersColl->insertOne($user);
		else
			return false;
		return $res;
	}


	function session($arr)
	{
		$tmp =	$this->sessionColl->findOne(array('sessionID' => $arr['sessionID']));
		if($tmp != NULL)
		{
			$start_time = $tmp['start'];
			$date = DateTime::createFromFormat("Y-m-d H:i:s", $start_time);
			$current_time = new DateTime('now');
			$diff = $current_time->getTimestamp() - $date->getTimestamp();
			if($diff > (5*60))
			{
				$this->sessionColl->deleteOne(array('sessionID' => $arr['sessionID']));
				return false;
			}
		}
		else
			return false;
		
		return true;
	}
}