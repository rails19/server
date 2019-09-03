<?php
/*This is framework file, that includes to every API-script, that
* executes on this server*/


/*Here we have some globals that sets script behaviour in
* different cases. User can redeclare any of them. Each variable are
* commented and default-valued. */

$GLOBALS['e_debug_mode'] = true;
//Do not show error text, when something is broken. Just throw status
//with error.
$GLOBALS['e_limit_offset'] = false;
//Aborts script with 400 Bad Request, when there's no limit or offset
//parameters, even though they can be created automatically.
$GLOBALS['e_if_conflict'] = false;
//Do not abort script with 409 Conflict, if some of data you're trying
//to add is already exists, just rewrite it. For example, users with
//the same email, or channel with the same nickname.


/*Use this bundle of globals to catch errors through script exec. */

$GLOBALS['e_absent_params'] = [];
//Every unexisting parameter you're trying to catch by demand() will
//be stored here
$GLOBALS['e_inappropriate_params'] = [];
//Store all inappropriate params here and process they all as whole.


/*Use this array to set test for params. */

$GLOBALS['e_params_test'] = [
	'limit' => ['max'=>1000, 'min'=>0, 'default'=>20],
	'offset' => ['max'=>INF, 'min'=>0, 'default'=>0]
];


/*Use this array to set credentials for databases. The structure is:
* [dbname => [host, login, password], ...] */

$GLOBALS['e_credentials'] = [
	'mainstock' => [
		'host' => '',
		'login' => '',
		'password' => ''
	]
];

/*Connection string may vary if you want to connect to localhost. */
$GLOBALS['e_connect_to_local'] = true;

$GLOBALS['e_default_db'] = 'default db name';



function abort_script($json, $errorcode=500){
	/*This function aborts script execution with showing encoded
	* $json.*/

	if(!isset($json))
		$json = [
			'errcode' => $errorcode
		];
	echo json_encode($json);

	exit;
}


function limitize($n=0, $a=-INF, $b=INF){
	/*Use this function to fit the $n into range between $a and $b. */

	return $n<$a //if less than $a
			? $a //then return $a
			: $n>$b //if bigger then $b
				? $b // then return $b
				: $n; //else return $n
}


function defaultize($variable=null, $default=null){
	/*This function return $variable if it is set and $default
	* otherwise. */

	return ( !$variable or !isset($variable) )
			? $default
			: $variable;
}


function decode_bitmask($mask=0, $properties=[]){
	/*This function takes $properties that is list of peoperties that
	* encoded in $mask. There's no limit to input data. We flip the
	* properties array from [[0]=>a, [1]=>b] to [a=>0, b=>1]. Then
	* looping that array with iterative $n, that starts from 0 and do
	* some bitwise operation to check if n-th bit is set. */

	$properties = array_flip($properties);
	$n = -1;
	foreach($properties as $property => &$value)
		$value = ($mask & 1<<++$n) ? true : false;

	return $properties;
}


function encode_bitmask($properties=[]){
	/*This function takes $properties that is associative array of
	* properties and their values: [prop1=>true, prop2=>false]. Then
	* it sets correspond bits from the side right and returns result.
	* Note, that $n is iterative. */

	$mask = 0;
	$n = -1;
	foreach($properties as $property => $value){
		$n++;
		if($value)
			$mask |= 1<<$n;
	}

	return $mask;
}


function bad_request($parameters=[]){
	/*This function raise 400 Bad Request error code. This means that
	* some of parameters user must pass to API-script is absent or
	* GET query with this parameters returned no result. In
	* $parameters just list all of them. */

	http_response_code(400);

	abort_script([
		'errcode' => 400,
		'fields' => $parameters
	]);
}


function conflict($sources=[]){
	/*Raise 409 Conflict. This means that some of data user trying to
	* write is already exists. (Error on 'duplicate key' and so on).
	* Pass all sources (e.g. tables) in $sources*/

	http_response_code(409);

	abort_script([
		'errcode' => 409,
		'sources' => $sources
	]);
}


function unprocessable_entity($fields=[]){
	/*Raise 422 Unpocessable Entity. This means that some of API
	* parameters are invalid. $fields must contains associative
	* array with all fields and reason of their invalidity. Example:
	* $fields = [ ['name'=>..., 'description'=>...], ... ] */

	http_response_code(422);

	abort_script([
		'errcode' => 422,
		'fields' => $fields
	]);
}


function internal_error($file=__FILE__, $line=0, $string='Uncaught'){
	/*Raise 500 Internal Server Error. This means that some internal
	* error had happened. If 'error_debug_mode' switched on, there
	* will also be 'debug' object. */

	http_response_code(500);
	$debug = [
		'time' => date("Y-m-d H:i:s"),
		'file' => $file,
		'line' => $line,
		'string' => $string
	];
	$response = [
		'errcode' => 500
	];
	if($GLOBALS['e_debug_mode'])
		$response['debug'] = $debug;

	abort_script($response);
}


function bad_gateway($url='', $text='Unknown'){
	/*Raise 502 Bad Gateway. This means that some error with quering
	* to another server happened. */

	http_response_code(502);
	$debug = [
		'time' => date("Y-m-d H:i:s"),
		'url' => $url,
		'text' => $text
	];
	$response = [
		'errcode' => 502
	];
	if($GLOBALS['e_debug_mode'])
		$response['debug'] = $debug;

	abort_script($response);
}


function demand($what='', $note=true){
	/*Use this function to catch $what-paremeter from request.
	* E.g if $what='url', value from $_REQUEST['url'] will be returned
	* If variable is absent, E_USER_ERROR will be raised. If $note is
	* switched on, missing parameter will be added to GLOBAL
	* 'e_absent_params'*/

	$variable = null;
	if( isset($_REQUEST[$what]) ){
		return $_REQUEST[$what];
	}else{
		if($note)
			array_push(
				$GLOBALS['e_absent_params'],
				$what
			);
		return null;
	}

	return $variable;
}


function grab($what='', $default=null){
	/*Use this function like demand(), but you can set $default that
	* will be used if parameter is absent.
	* GLOBAL'e_params_test' contains keys of all parameters that
	* should pass test.*/

	$variable = demand($what, false);
	if(
		in_array(
			$what,
			array_keys($GLOBALS['e_params_test'])
		)
	){
		return defaultize(
			limitize(
				$variable,
				$GLOBALS[$what]['min'],
				$GLOBALS[$what]['max']
			),
			$GLOBALS[$what]['default']
		);
	}

	return $variable ? $variable : $default;
}


function connect_pdo($dbname=null){
	/*This function returns PDO connection to database. Just pass
	* name of db and all the credentials will be used from
	* GLOBAL'e_credentials' automatically. */

	if(!$dbname)
		$dbname = $GLOBALS['e_default_db'];
	$account = $GLOBALS['e_credentials'][$dbname];
	try{
    	$db = new PDO(
    		"mysql:host={$account['host']};".
    		"dbname={$dbname};charset=utf8",
    		$account['login'], $account['password']);

    	return $db;
    }catch(PDOException $e){
    	bad_gateway(
    		$account['host'],
    		$e->getMessage()
    	);
    }
}


function connect_mongo($dbname=null){
	/*Returns Mongo connection.*/

	if(!$dbname)
		$dbname = $GLOBALS['e_default_db'];
	$account = $GLOBALS['e_credentials'][$dbname];
	if($GLOBALS['e_connect_to_local'])
		return $client = new MongoDB\Driver\Manager(
			"mongodb://localhost:27017"
		);
	else
		return $client = new MongoDB\Driver\Manager(
			"mongodb+srv://{$account['login']}:{$account['password']}".
			"@{$account['host']}"
		);
}


function defdbip(){
	/*This function returns IP of the database that set as default in
	* credentials. That can be used for debugging when throwing
	* bad_gateway errors. */

	$defdb = $GLOBALS['e_default_db'];
	return $GLOBALS['e_credentials'][$defdb]['host'];
}


function ask_pdo($connection=null, $sql='', $args=[]){
	/*Use this function to make requests to db. $connection is PDO
	* class that returns connect(), $sql is SQL statement and $args is
	* arguments that are pretends to be binded.
	* $args = [ [name, data, type], ... ]
	* Types are PDO::PARAM_STR and PDO::PARAM_INT. Pass name of args
	* without ":" */

	$statement = $connection->prepare($sql);
	foreach($args as $parameter){
		$statement->bindParam(
			$parameter[0],
			$parameter[1],
			$parameter[2]
		);
	}
	$statement->execute();
	if( $statement->rowCount()<1 ){
		if( $GLOBALS['e_on_empty_db'] )
			bad_request();
		else
			return null;
	}
	$result = [];
	while( $row = $statement->fetch(PDO::FETCH_ASSOC) )
		array_push($result, $row);
	$statement->closeCursor();
	print_r($sql);

	return $result;
}

/*This requierment allows you to construct classes as it described in
* specification: spec/api-structure.html */

require_once 'classes.php';
?>
