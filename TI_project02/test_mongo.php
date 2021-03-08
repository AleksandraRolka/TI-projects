<?php
 
require 'vendor/autoload.php' ;
include 'rest/mongo.php';
$db = new db();
 
print "<pre>" ;
 
print "Polaczono z baza danych" ;

print "\n<br/>------------ <br/>\n" ;
// Test insert()
print "Test insert() function <br/>" ;
$record = $record = array ( 'age1' => 0, 'age2' => 0, 'age3' => 0, 'age4' => 0, 'day' => 0, 'night' => 0 );
$flag = $db->insert($record);
//print "[ ".$flag." ]";
print $flag?"Insert OK":"not OK";
 
print "\n<br/>------------ <br/>\n" ;

print "</pre>" ;
 
?>