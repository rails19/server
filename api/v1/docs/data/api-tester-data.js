//get, post (add), put, patch, delete

/*
method: {description, responses}
response: {meaning, body}
parameter: {type, required, description, examples, default}
examples: [...]
*/

APITester.name = 'Suburban Server API';
APITester.v = '1';
APITester.testingPath = 'localhost:8080/api/v1';
APITester.paths = [];
APITester.attachments = {};
APITester.reusable = {};

APITester.reusable.Variable_fulldate = '2018-07-12T09:28:47+02:00';
APITester.reusable.Variable_date = '2018-07-12';

APITester.reusable.Property_route = {
	type: 'integer',
	maxLength: 4,
	description: 'ID of route.',
	default: null,
	example: 1111
};

APITester.reusable.Property_train = {
	type: 'integer',
	maxLength: 4,
	description: 'ID of train.',
	default: null,
	example: 6047
};

APITester.reusable.Property_stationName = {
	type: 'string',
	maxLength: 50,
	description: 'Name of the station.',
	default: null,
	unique: 'name',
	example: 'Київ пасажирський'
};

APITester.reusable.Property_stationID = {
	type: 'integer',
	maxLength: 5,
	description: 'ID of the station.',
	default: null,
	unique: 'id'
};

APITester.reusable.Property_userID = {
	type: 'integer',
	maxLength: 15,
	description: 'Internal ID of the user.',
	default: null,
	unique: true
};

APITester.reusable.Property_userName = {
	type: 'string',
	maxLength: 35,
	description: 'Name of the user',
	defalut: null
};

APITester.reusable.Params_stationID = {
	in: 'path',
	name: 'id',
	type: 'integer',
	required: true,
	description: 'ID of the station',
	examples: [6548, 1225],
	default: null
}

APITester.reusable.Params_limitoffset = [
	{
		in: 'query',
		name: 'limit',
		type: 'integer',
		required: false,
		description: 'Number of limit of current selection.',
		examples: [10, 15, 5],
		default: 10,
		minimum: "0",
		maximum: 1000
	},
	{
		in: 'query',
		name: 'offset',
		type: 'integer',
		required: false,
		description: 'Offset in items of current selection.',
		examples: [10, 100, 200],
		default: 0,
		minimum: "0"
	}
];

APITester.reusable.Params_departureLimit = {
	in: 'query',
	name: 'departuresLimit',
	type: 'integer',
	required: false,
	description: 'Number of limit of departures.',
	examples: [10, 15, 5],
	default: 10,
	minimum: "0",
	maximum: 50
}

APITester.reusable.Examples_dates = ['24-15-2018', '15-01-2017'];
APITester.reusable.Params_dateFromTo = [
	{
		in: 'query',
		name: 'dateFrom',
		type: 'date',
		required: false,
		description: 'Start date of selection',
		examples: APITester.reusable.Examples_dates,
		default: null
	},
	{
		in: 'query',
		name: 'dateTo',
		type: 'date',
		required: false,
		description: 'End date of selection',
		examples: APITester.reusable.Examples_dates,
		default: null
	}
];

APITester.paths = {
	'auth/tg': {
		'get' : {
			description: 'Authorize user via Telegram. If this account was banned, then you\'ll get 403 error, or 422 if the data is incorrect.',
			parameters: [
				{
					in: 'query',
					name: 'id',
					type: 'integer',
					required: true,
					description: 'ID of user.',
					examples: [396931567]
				},
				{
					in: 'query',
					name: 'name',
					type: 'string',
					required: true,
					description: 'Name of user. first_name + last_name combination can be used.',
					examples: ["Name Prizvyschenko"]
				},
				{
					in: 'query',
					name: 'date',
					type: 'string',
					required: true,
					description: 'auth_date widget field.',
					examples: [1570616808]
				},
				{
					in: 'query',
					name: 'photo',
					type: 'string',
					required: true,
					description: 'photo_url widget field.',
					examples: ["valid link"]
				},
				{
					in: 'query',
					name: 'hash',
					type: 'string',
					required: true,
					description: 'hash widget field.',
					examples: ["long number-letter sequence"]
				}
			],
			raises: [200, 403, 422],
			response: {
				context: 'Object',
				class: 'User'
			}
		}
	},
	'station/lookfor/{query}': {
		'get': {
			description: 'Search stations by query.',
			parameters: [
				{
					in: 'path',
					name: 'query',
					type: 'string',
					required: true,
					description: 'Search query',
					examples: ['Аккаржа', 'Білг', 'Одес'],
					default: null,
				},
				{
					in: 'query',
					name: 'limit',
					type: 'integer',
					required: false,
					description: 'Number of limit of current selection.',
					examples: [10, 15, 5],
					default: 6,
					minimum: "0",
					maximum: 20
				},
				APITester.reusable.Params_departureLimit
			],
			raises: [200, 400],
			response: {
				context: 'Array',
				class: 'ShortStation'
			}
		}
	},
	'station/{id}': {
		'get': {
			description: 'Get station by its ID.',
			parameters: [
				APITester.reusable.Params_stationID,
				APITester.reusable.Params_departureLimit
			],
			raises: [200, 403, 404],
			response: {
				context: 'Object',
				class: 'Station'
			}
		}
	},
	'station/nearest': {
		'get': {
			description: 'Returns info about nearest station.',
			parameters: [
				{
					in: 'query',
					name: 'lat',
					type: 'integer',
					required: false,
					description: 'Latitude of the user. If not specified, IP location will be used.',
					examples: [50.1158],
					default: null
				},
				{
					in: 'query',
					name: 'lon',
					type: 'integer',
					required: false,
					description: 'Longitude of the user. If not specified, IP location will be used.',
					examples: [25.7198],
					default: null
				},
				{
					in: 'query',
					name: 'limit',
					type: 'integer',
					required: false,
					description: 'Limit of stations.',
					examples: [1, 2, 3],
					minimum: "0",
					maximum: 10,
					default: 1
				},
				APITester.reusable.Params_departureLimit
			],
			raises: [200, 403, 422],
			response: {
				context: 'Array',
				class: 'Station'
			}
		}
	},
	'station/{id}/directions': {
		'get': {
			description: 'Get station reachable without changing the train.',
			parameters: [
				APITester.reusable.Params_stationID,
				{
					in: 'query',
					name: 'showIntermediate',
					type: 'bool',
					required: false,
					description: 'If this parameter is not checked, only endings of the routes will be showed.',
					defalut: false,
					examples: [],
				}
			],
			raises: [200, 403],
			response: {
				context: 'Array',
				class: 'ShortStation'
			}
		}
	},
	'station/{id1}/to/{id2}': {
		'get': {
			description: 'Make a route between two given stations.',
			raises: [200, 403, 404],
			response: {
				context: 'Array',
				class: 'PlannedRoute'
			},
			parameters: [
				{
					in: 'path',
					name: 'id1',
					type: 'integer',
					required: true,
					description: 'ID of the first station',
					examples: [6548, 1225],
					default: null
				},
				{
					in: 'path',
					name: 'id2',
					type: 'integer',
					required: true,
					description: 'ID of the second station',
					examples: [6548, 1225],
					default: null
				},
				{
					in: 'query',
					name: 'avoidTransfers',
					type: 'bool',
					required: false,
					description: 'Method will return 404 Not Found error, if route cannot be formed without train transfers.',
					examples: [""],
					default: false
				},
				{
					in: 'query',
					name: 'startDate',
					type: 'string',
					required: false,
					examples: [APITester.reusable.Variable_fulldate],
					default: "Current date&time",
					description: 'Time, when trip should start.'
				}
			]
		}
	},
	'route/{id}': {
		'get': {
			description: 'Get route (train schedule) by its id.',
			parameters: [
				{
					in: 'path',
					name: 'id',
					type: 'integer',
					required: true,
					description: 'Number of the train.',
					examples: [6048, 7041],
					default: null
				}
			],
			raises: [200, 404],
			response: {
				context: 'Object',
				class: 'TrainSchedule'
			}
		}
	},
	'trips': {},
	'trip/{id}': {},
}

APITester.classes = {
	User: {
		description: 'User info.',
		properties: {
			'id': APITester.reusable.Property_userID,
			'name': APITester.reusable.Property_userName
		}
	},
	Station: {
		description: 'This class represents station.',
		properties: {
			'name': APITester.reusable.Property_stationName,
			'id': APITester.reusable.Property_stationID,
			'isPlatform': {
				type: 'bool',
				description: 'Describes whether the station is platform (зупинковий пункт).',
				default: false,
				example: 'false'
			},
			'direction': {
				type: 'integer',
				maxLength: 2,
				description: 'Direction of the station, where first number is one of "Львівська", "Одеська", etc., and the second one is subdirection. See the attachment for details.',
				default: null,
				example: 42
			},
			'departures': {
				refClass: 'Departure',
				type: 'array',
				description: 'Array of nearest departures.'
			}
		}
	},
	ShortStation: {
		description: 'The main information about station',
		properties: {
			'name': APITester.reusable.Property_stationName,
			'id': APITester.reusable.Property_stationID
		}
	},
	Departure: {
		description: "Represents nearest departure from station.",
		properties: {
			'estimate': {
				type: 'integer',
				maxLength: 4,
				description: 'Time to this departure in minutes',
				default: null,
				example: 8
			},
			'route': APITester.reusable.Property_route,
			'train': APITester.reusable.Property_train,
			'start': {
				refClass: 'ShortStation',
				type: 'object',
				description: 'Start station of the entire route.'
			},
			'end': {
				refClass: 'ShortStation',
				type: 'object',
				description: 'End station of the entire route.'
			}
		}
	},
	TrainSchedule: {
		description: "Represents schedule of the train.",
		properties: {
			'train': {
				refClass: 'Train',
				type: 'object',
				description: 'Class of the train.'
			},
			'path': {
				refClass: 'ScheduleItem',
				type: 'array',
				description: 'Array of schedule items.'
			}
		}
	},
	ScheduleItem: {
		description: "Represents item of the schedule: station, arrival/departure time, stop time, etc.",
		properties: {
			'station': {
				refClass: 'ShortStation',
				type: 'object',
				description: 'A station.'
			},
			'arrival': {
				type: 'string',
				description: 'Time, when train arrives to the station.',
				default: null,
				examples: [APITester.reusable.Variable_fulldate]
			},
			'departure': {
				type: 'string',
				description: 'Time, when train departs from the station.',
				default: null,
				examples: [APITester.reusable.Variable_fulldate]
			}
		}
	},
	PlannedRoute: {
		description: "Represents planned route between two station, which may include transfers.",
		properties: {
			'path': {
				refClass: 'TrainSchedule',
				type: 'array',
				description: 'Clipped schedule of trains, which shapes the route.'
			}
		}
	},
	Train: {
		description: "Represents a train",
		properties: {
			'n': {
				type: 'integer',
				description: "Number (and ID) of the train.",
				unique: true,
				default: null,
				example: 6048
			}
		}
	}
}

APITester.errors = {
	ok: [
		{
			name: 'OK',
			code: 200,
			description: 'This error will be returned, if API script executed successfully. In this case body will contain JSON-info with error code and script result.',
			body: {
				errcode: 200,
				result: {}
			}
		},
		{
			name: 'No Content',
			code: 204,
			description: 'This error will be returned, if API script executed successfully, but nothing to return.',
			body: {
				errcode: 204
			}
		}
	],
	client: [
		{
			name: 'Bad Request',
			code: 400,
			description: 'Some of GET parameters is absent.',
			body: {
				errcode: 400,
				fields: [
					'fieldexample1', 'fieldexample2'
				]
			}
		},
		{
			name: 'Forbidden',
			code: 403,
			description: 'Your account are not allowed to perform this action.',
			body: {
				errcode: 403
			}
		},
		{
			name: 'Not Found',
			code: 404,
			description: 'No matches found.',
			body: {
				errcode: 404
			}
		},
		{
			name: 'Unprocessable Entity',
			code: 422,
			description: 'Some of fields you are passing is invalid.',
			body: {
				errcode: 422,
				fields: [
					{
						name: 'email',
						description: 'Too short. More than 10 symbols expected'
					},
					{
						name: 'access_token',
						description: 'Unsafe parameter. SHA-encrypted data expected.'
					},
					{
						name: 'id',
						description: 'String expected, but got Integer.'
					}
				]
			}
		}
	],
	server: [
		{
			name: 'Internal Server Error',
			code: 500,
			description: 'Script raised error. If debug-mode was turned on, body will also contain `debug` object.',
			body: {
				errcode: 500,
				debug: {
					time: '2018-12-18 12:13:24',
					file: 'api/v1/script_name.php',
					line: 43,
					string: "Undefined variable $variable"
				}
			}
		},
		{
			name: 'Bad Gateway',
			code: 502,
			description: 'This error will be returned, if script are trying to make requests to other server and they not respond or returns empty result. There will be also `debug` object, if debug-mode was turned on.',
			body: {
				errcode: 502,
				debug: {
					time: '18-12-2018 12:13',
					url: '...',
					response: '...'
				}
			}
		}
	]
}
