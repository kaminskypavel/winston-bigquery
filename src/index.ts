import Transport from 'winston-transport';
import {BigQuery} from '@google-cloud/bigquery';
import env from './commons/env';
import _ from 'lodash';
import dotenv from 'dotenv';
dotenv.config();

interface WinstonBigQueryOptions {
	datasetId: string;
	tableId: string;
	applicationCredentials?: string;
}

export class WinstonBigQuery extends Transport {
	bigquery: BigQuery;
	options: WinstonBigQueryOptions;

	constructor(options: WinstonBigQueryOptions) {
		super();
		this.bigquery = new BigQuery();

		if (_.isEmpty(options.datasetId)) {
			throw new Error("Missing required 'datasetId' in construction");
		}

		if (_.isEmpty(options.tableId)) {
			throw new Error("Missing required 'tableId' in construction");
		}

		if (
			!env.getEnvVariable('GOOGLE_APPLICATION_CREDENTIALS') &&
			!options.applicationCredentials
		) {
			throw new Error(
				'Missing required GOOGLE_APPLICATION_CREDENTIALS, please add it as to construction object or as enviroment variable. read more here : http://bit.ly/2k0D1cj '
			);
		}

		if (env.isDevelopment()) {
			console.log(
				`loading GOOGLE_APPLICATION_CREDENTIALS from "${env.getEnvVariable(
					'GOOGLE_APPLICATION_CREDENTIALS'
				)}"`
			);
		}
		this.options = options;
	}

	async log(info: any, next: () => void) {
		const {datasetId, tableId} = this.options;

		const {message, level, splat} = info;
		// await this.bigquery
		// 	.dataset(datasetId)
		// 	.table(tableId)
		// 	.insert(info);
		console.log(JSON.stringify(info));
		console.log(message, level, splat);
		next();
	}
}
