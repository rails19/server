<?php
/*This file routes GET, POST, PUT, PATCH and DELETE user queries
* to the corresponds php script. To get the idea of structure, please
* go to api-structure.html in this directory*/

header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Credentials: true");

$api_v = "v1";
$request_uri = $_SERVER["REQUEST_URI"];
$method = $_SERVER['REQUEST_METHOD'];
$framework_uri = "env.php";
$shell_uri = "shell.php";

if(!strcmp(substr($request_uri, 1, 6), "shell:")){
	header('Content-Type: text/html; charset=UTF-8');
	$_GLOBAL["shell_command"] = rawurldecode(
		substr($request_uri, 7));
	require_once $shell_uri;
	die();
}

header('Content-Type: application/json; charset=UTF-8');

//wipe out get-parameters if they passed
$request_uri = explode("?", $request_uri)[0];

$path = explode('/', $request_uri);
//slice (/tg/api/v2/methodname) to (methodname)
$f = array_slice($path, array_search($api_v, $path)+1);
$dir = dirname(__FILE__);

if($method!=='GET' or $method!=='POST'){
	$params = [];
	parse_str(file_get_contents("php://input"), $params);
	$_REQUEST = array_merge($params, $_REQUEST);
}

//we're going to parse url to file recursively
function callScript($path){
	global $dir;
	global $path_params;
	global $method;

	//recursion exit
	if( count($path)==0 ){	
		return "{$dir}/{$method}-index.php";
	}

	$curr_level = array_pop($path); //reduce $path
	$folder = scandir($dir);

	if( in_array($curr_level, $folder) ){
		//go ahead, if this directory exists
		$dir .= "/{$curr_level}";
	}else{
		//if not, maybe it's the path parameter?
		//looking for _underline folders
		foreach ($folder as $root)
            if($root[0] == '_')
				$params[] = $root;
		//if it's really a path parameter...
		if( isset($params) and count($params)!==0 ){
			$param_name = substr($params[0], 1);
			//remember that
			$_REQUEST[ $param_name ] = $curr_level;
			$dir .= "/_{$param_name}";
		}else{
			http_response_code(404);
			die();
		}
	}
	return callScript($path);
}
$scriptName = callScript( array_reverse($f) ); //convert to stack

if( file_exists($scriptName) ){
	require_once $framework_uri;
	require_once $scriptName;
}else{
	http_response_code(404);
	die();
}
?>
