import {WinstonBigQuery} from '../';
import winston from 'winston';

const logger = winston.createLogger({
	level: 'debug',
	transports: [
		new WinstonBigQuery({
			datasetId: 'logs',
			tableId: 'my_winston_logs3'
		})
	]
});

try {
	logger.warn('Hello World');
} catch (error) {
	console.log(error);
}
