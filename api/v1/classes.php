<?php
/*This file sets classes and standards as it described in
* specification: docs/api-structure.html. Note that it's not real PHP
* classes but constructor functions you can use. */


function ISO8601($string=''){
	/*Converts db date format to ISO8601 with 2 hour Kyiv offset.
	* 2017-04-17 12:23:52 to 2017-04-17T12:23:52+03:00,
	* 2017-04-17 stays as it was. */

	if( strlen($string)==10 ){
		return $string;
	}else{
		$arr = explode(" ", $string);
		return "{$arr[0]}T{$arr[1]}+03:00";
	}
}


function URLStd($string=''){
	/*This function converts urls to standard view. */

	return htmlentities($string);
}

?>
