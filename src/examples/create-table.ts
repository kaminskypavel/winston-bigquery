/**
 * This example will generate the big query table from the structure of the schema field in options.
 * deep nested fields will be translated to a flat string representation with "_" delimiter.
 */

import {WinstonBigQuery} from '../';
import winston from 'winston';
import {delay} from '../commons/delay';

const logger = winston.createLogger({
	level: 'debug',
	transports: [
		new WinstonBigQuery({
			dataset: 'logs',
			table: 'my_winston_logs',
			schema: {
				timestamp: 'timestamp',
				firstName: 'string',
				lastName: 'string',
				session: {
					userId: 'integer'
				}
			},
			create: true
		})
	]
});

(async () => {
	try {
		await delay(3 * 1000);

		logger.debug('Round kick from chuck! Bam!', {
			session: {
				userId: 1
			},
			firstName: 'chuck',
			lastName: 'norris'
		});
	} catch (error) {
		console.log(error);
	}
})();
