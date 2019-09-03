_This API was designed for another project, which use MySQL DB, so it contains some methods to work with it. Since current project won't use SQL, corresponding methods can be safely deleted, but let them stay, ok?_

# Suburban Server API v1 Specification
_Edition: 03.09.2019_  

This document describes, how API v1 should looks like. It's just the basic concepts, which will be used for creating.

# Basics

## Call methods
`.htaccess` file should be modified to provide access to API methods without specifying `.php` extension.
Some script has path parameters, so user must be routed to correct URL.

## API Structure
You can see API structure, classes and errors in api-structure.html in this directory.

## Scripts structure
```php
//include first layer
require('env.php');

/*
* then do some magic work here,
* like quering databases and fetching
* data and so on
*/

//then result must be prepared
$result = "...";
$error_code = 200;

//finally, you have to include third layer
require('output.php');
//it catches the $result and ends script with user output
```

# First layer: sever commutator
This layer are framework to all of the scripts and here's what it can do.

## Deal with bitmasks
If your parameters are encoded with bitmask, you can simply decode it back by:
```php
array bitmask(number $Mask, array $Properties);
```
Lets see how it works:
```php
$state = bitmask(6, ["property1", "property2", "property3"]);

/*this function convert $Mask to binary
* 6 -> 110
* the properties you'd passed are about to connect
* inversely with the bitmask numbers
* 1 -> property3
* 1 -> property2
* 0 -> property1
* then it wil be used when creating name array
*/

$state == {
	'property1' => false,
	'property2' => true,
	'property3' => true
}
```
It would big mistake to show the bitmask as API output, as it's little bit complicated.

## Catch GET-parameters
If you're trying to get query parameter, just pass this:
```php
mixed get(string $ParameterName [, mixed $DefaultParameter]);
```
It returnes `$_GET[$ParameterName]`, if it is provided and if it has correct value. Otherwise, `$DefaultParameter` will be returned. If it's not set, function returnes `null`.  
Some parameters has default, minimum and maximum values.  
If the script can't execute without this parameter, pass this:
```php
mixed demand(string $ParameterName);
```
It raises `400` error if the parameter is absent.

## Connect to DB
You can store the credentials in `$dbs`:
```php
$dbs == {
	'host' => ['username', 'dbname', 'password'],
	'host1' => ['username1', 'db1name', 'password1']
}
```
After that you can simply connect to database:
```php
$connection = connect('host');
//it will use correct credentials from $dbs automatically
```

## Make SQL requests
This layer using PDO to connect to DB, so you must bind parameters before quering to prevent SQL-injections. The quering looks like this:
```php
$query = ask(
	$connection,
	"...sql statement with :parameter1 and :parameter2",
	[
		[
			"parameter1",
			$variable_that_contains_parameter1,
			PDO::PARAM_INT //or PDO::PARAM_STR
		],
		[
			"parameter2",
			$parameter2,
			PDO::PARAM_STR
		]
	]
)
```
As result, `$query` will contain fully fetched result.  
Please, work carefully with SQL-queries, uppercase your `SELECT`, `WHERE`, `LIMIT` and so on, do NOT use 2-layered IF statement to prepare SQL, as it becomes heavy.

## Sets classes
If you haven't visited `api-structure.html` in this directory, please go and check it. There are some info about standard classes. They are supported by first layer. You can work with them like this:
```php
$channels = ask(...);
//an array with list of channels was returned

$result = [];

foreach ($channels as $item) {
	/*
	* here you can perform some actions with your result
	*/
	$result[] = new Channel($item);
}
```
That is, you just create new object and pass array with results there.

## Set error handlers
There are also list of all errors script might raise. First layer catch them and abort execution if needed.

You can change some error inhabitance by changing these globals:  
`$_GLOBALS['globalname'] = default value`

`$_GLOBALS['error_debug_mode'] = false`
do not show error text, when something is broken, just throw error code.

`$_GLOBALS['error_on_pdo'] = true`
aborts script with `502 Bad Gateway` error code when there was troubles with connecting to DB.

`$_GLOBALS['error_on_empty_db'] = false`
aborts script with `502 Bad Gateway` when SQL-query returns 0 rows.

`$_GLOBALS['error_limit_offset'] = false`
aborts script with `400 Bad Request`, when there's no `limit` or `offset` parameters, even though they can be created automatically.

`$_GLOBALS['error_if_conflict'] = false`
do not abort script with `409 Conflict`, if some of data you're trying to add is already exists, just rewrite it. For example, users with the same email, or channel with the same nickname.

# Second layer: scripting
That's the part you're working with. Just use the benefits framework gives you and code easy.

If something unexpected happened, raise error with these functions
```php
	/*400 Bad Request: some of parameters are absent.
	* just list all of the absent parameters.
	* this error will also be raised on catching
	* empty parameters with demand().*/
	bad_request(
		['field1', 'field2']
	);

	/*409 Conflict: some of data you're trying to
	* write is already exists.
	* this error will also be raised on
	* such PDO responses ('duplicate key' and so on).*/
	conflict(
		['table1', 'table2']
	);

	/*422 Unprocessable Entity: some of parameters
	* are invalid. this error will also be raised if
	* parameters do not pass checking on first layer.*/
	unprocessable_entity(
		[
			[
				'name' => 'name of parameter',
				'description' => 'describe, what\'s wrong with this parameter'
			]
		]
	);

	/*500 Internal Server Error: something went wrong,
	* and you dont want to tell user what exactly.
	* this error will be raised automatically on something
	* unexpected, but please DO NOT raise it by yourself,
	* handle all of errors and tell the user, what's wrong.
	* this error is mark of bad designed code.*/
	internal_error([
		//the time and file properties will appeared automatically
		'line' => 43,
		'string' => 'i\'d got offense at you'
	]);

	/*502 Bad Gateway: error with quering to another server.
	* DO NOT raise it, if you don't understand, what is this.*/
	bad_gateway([
		'url' => '...',
		'response' => 'response of that url'
	]);
```

# Third layer: user output
Just connect `output.php` to your script. It will catch the `$result` and `$error_code`, show JSON-stringifyed data and exit the script.

```php
//some script goes here...

$result = "..."; //your result
$error_code = 200; //or 204

require('output.php');
```
