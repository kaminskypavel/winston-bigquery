import {WinstonBigQuery} from '../';
import winston from 'winston';

const logger = winston.createLogger({
	level: 'debug',
	transports: [
		new WinstonBigQuery({
			dataset: 'logs',
			table: 'my_winston_logs3',
			schema: {
				timestamp: 'timestamp',
				firstName: 'string',
				lastName: 'string',
				session: {
					userId: 'integer'
				}
			},
			dropCreate: true
		})
	]
});

logger.debug('Round kick from chuck! Bam!', {
	session: {
		userId: 1
	},
	firstName: 'chuck',
	lastName: 'norris'
});
