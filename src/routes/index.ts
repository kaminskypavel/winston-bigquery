import demoRoute from './demoRoute';
import {Express, Response} from 'express';
import logger from '../commons/logger';
import {isEnableMonitoring, isEnableSwagger} from '../commons/env';
import swaggerDocument from '../../swagger.json';
import swaggerUi from 'swagger-ui-express';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const statusMonitor = require('express-status-monitor')();

export default (app: Express) => {
	app.use('/demo', demoRoute);

	if (isEnableMonitoring()) {
		app.get('/_monitor', statusMonitor.pageRoute);
	}

	if (isEnableSwagger()) {
		app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
	}

	app.get('/', (req, res: Response) => {
		res.jsend.success('ok');
	});
	app.use('*', (req, res: Response) => {
		logger.error('accessing invalid route');
		res.jsend.error('invalid route');
	});
};
