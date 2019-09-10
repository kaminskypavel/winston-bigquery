/**
 * This example will is assuming you've already have a table create in bigquery.
 * we will see how a deeply nested unknown field which are not part of the schmea
 * are auto injected in to the "meta" field
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
		logger.info('Hello World', {
			character: {
				name: 'mister meesiks',
				hobbies: 'hey! look at me!'
			}
		});
	} catch (error) {
		console.log(error);
	}
})();
