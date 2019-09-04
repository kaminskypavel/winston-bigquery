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

logger.info('this is a Hello World', {
	meta1: 1,
	meta2: 'string',
	meta3: {deepObj: 1}
});
