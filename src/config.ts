import { config } from 'jovo-framework';

// tslint:disable-next-line
export = config({
	logging: true,

	intentMap: {
		'AMAZON.StopIntent': 'END',
		'actions.intent.NO_MATCH_1': 'Unhandled',
		'actions.intent.NO_MATCH_2': 'Unhandled',
		'actions.intent.NO_MATCH_FINAL': 'Unhandled'
	},
	db: {
		FileDb: {
			pathToFile: './../../db/db.json'
		}
	}
});
