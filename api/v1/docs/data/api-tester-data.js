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
	/*errors will be here*/
}
