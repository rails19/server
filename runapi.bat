@ECHO off

SET /p version="Version of API [v1|v...]: "

php -S localhost:8080 "api/%version%/router.php"