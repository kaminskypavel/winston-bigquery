import Transport from 'winston-transport';
import {BigQuery} from '@google-cloud/bigquery';
import env from './commons/env';
import _ from 'lodash';

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
				'Missing required GOOGLE_APPLICATION_CREDENTIALS, please add it as to construction object or as enviroment variable.\nread more here : http://bit.ly/2k0D1cj '
			);
		}

		this.options = options;
	}

	async log(info: any, next: () => void) {
		const {datasetId, tableId} = this.options;
		await this.bigquery
			.dataset(datasetId)
			.table(tableId)
			.insert(info);

		next();
	}
}
