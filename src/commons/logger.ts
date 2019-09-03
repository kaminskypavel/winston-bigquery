import winston, {format} from 'winston';
import {isDevelopment, isProduction} from './env';

const simpleFormat = format.printf(
	info => `[${new Date().toISOString()}] ${info.level}: ${info.message}`
);

const jsonFormat = format.combine(
	format.timestamp({
		format: 'YYYY-MM-DD HH:mm:ss'
	}),
	format.json()
);

const logger = winston.createLogger({
	level: 'info',
	format: simpleFormat,
	transports: [
		//
		// - Write to all logs with level `info` and below to `combined.log`
		// - Write all logs error (and below) to `error.log`.
		//
		new winston.transports.File({filename: 'combined.log'})
	]
});

if (isDevelopment()) {
	logger.add(
		new winston.transports.Console({
			format: format.combine(format.colorize(), simpleFormat)
		})
	);
}

export default logger;
