import app from './app';
import chalk from 'chalk';
import dotenv from 'dotenv';
import logger from './commons/logger';

dotenv.config();
const port = process.env.PORT;
app.listen(port, () => {
	logger.info(`simple-node-typescript-starter server is running`);
	logger.info(`navigate to http://localhost:${port}/demo`);
	logger.warn(
		chalk.bgYellow(
			`Please remember to disable monitoring and swagger in the .env file`
		)
	);
});
