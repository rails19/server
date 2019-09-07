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

APITester.reusable.Param_searchString = {
	in: 'query',
	name: 'q',
	type: 'string',
	required: false,
	description: 'Search string for your items.',
	examples: ["Cute puppies", "uaresistance"],
	default: null
};

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
	/*methods will be here.*/
}

APITester.classes = {
	/*classes will be here*/
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
