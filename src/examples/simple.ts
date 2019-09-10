/**
 * This example will is assuming you've already have a table create in bigquery.
 * if you'd like to create a table from your data check create-table.ts
 */

import {WinstonBigQuery} from '..';
import winston from 'winston';

const logger = winston.createLogger({
	level: 'debug',
	transports: [
		new WinstonBigQuery({
			dataset: 'logs',
			table: 'my_winston_logs'
		})
	]
});

(async () => {
	try {
		logger.info('Hello World');
	} catch (error) {
		console.log(error);
	}
})();
