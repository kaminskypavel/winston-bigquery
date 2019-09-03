import Transport from 'winston-transport';
import {BigQuery} from '@google-cloud/bigquery';
import env from './commons/env';
import {isEmpty, omit} from 'lodash';
import dotenv from 'dotenv';
import moment from 'moment';

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
		dotenv.config();
		console.log(new BigQuery());
		this.bigquery = new BigQuery();

		if (isEmpty(options.datasetId)) {
			throw new Error("Missing required 'datasetId' in construction");
		}

		if (isEmpty(options.tableId)) {
			throw new Error("Missing required 'tableId' in construction");
		}

		if (
			isEmpty(env.getEnvVariable('GOOGLE_APPLICATION_CREDENTIALS')) &&
			isEmpty(options.applicationCredentials)
		) {
			throw new Error(
				'Missing required GOOGLE_APPLICATION_CREDENTIALS, please add it as to construction object or as enviroment variable. read more here : http://bit.ly/2k0D1cj '
			);
		}

		if (env.isDevelopment() || env.isTest()) {
			console.log(
				`loading GOOGLE_APPLICATION_CREDENTIALS from ${env.getEnvVariable(
					'GOOGLE_APPLICATION_CREDENTIALS'
				)}`
			);
		}
		this.options = options;
	}

	async log(info: any, next?: () => void) {
		const {datasetId, tableId} = this.options;
		const {message, level} = info;
		const meta = JSON.stringify(
			omit(JSON.parse(JSON.stringify(info)), ['message', 'level'])
		);
		const timestamp = moment()
			.utc()
			.format();

		await this.bigquery
			.dataset(datasetId)
			.table(tableId)
			.insert({
				timestamp,
				message,
				level,
				meta
			});

		next();
	}
}
