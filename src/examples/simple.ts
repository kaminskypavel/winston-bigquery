import {WinstonBigQuery} from '../';
import winston from 'winston';

const logger = winston.createLogger({
	level: 'debug',
	transports: [
		new WinstonBigQuery({
			datasetId: 'logs',
			tableId: 'my_winston_logs'
		})
	]
});

logger.info('Hello World', {
	firstName: 'chuck',
	lastName: 'norris',
	session: {
		userId: 'oh wow! this is nested!'
	}
});
