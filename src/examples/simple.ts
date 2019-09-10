import {WinstonBigQuery} from '../';
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
