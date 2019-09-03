import {WinstonBigQuery} from './index';
import winston from 'winston';

const logger = winston.createLogger({
	level: 'debug',
	transports: [
		new WinstonBigQuery({
			tableId: 'winston_logs',
			datasetId: 'logs'
		})
	]
});

logger.info('this is a Hello World', {
	meta1: 1,
	meta2: 'string',
	meta3: {deepObj: 1}
});
