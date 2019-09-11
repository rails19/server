<?php

$user = $_SERVER['PHP_AUTH_USER'];
$user_saved = getenv("sbseruser");
$password = $_SERVER['PHP_AUTH_PW'];
$password_saved = getenv("sbserpw");

if(!strlen($user_saved) || !strlen($password_saved)){
	header("HTTP/1.0 500 Internal Error");
	die("Password or username is not set.");
}

if(
	strcmp($user, $user_saved) ||
	strcmp($password, $password_saved)
){
	header("WWW-Authenticate: Basic realm=\"Authentication needed.\"");
	header("HTTP/1.0 401 Unauthorized");
	die("Not authorized");
}

?>
<!DOCTYPE html>
<html>
<head>
	<title>Shell execution</title>
	<meta charset="utf-8">
</head>
<body>
	<pre>
<?php

echo ">> " . $_GLOBAL["shell_command"] . "\n";
exec($_GLOBAL["shell_command"], $output);
echo htmlentities(
	utf8_decode(
		implode("\n", $output)));

?>
	</pre>
</body>
</html>