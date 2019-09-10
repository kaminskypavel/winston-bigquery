import Transport from 'winston-transport';
import {BigQuery} from '@google-cloud/bigquery';
import env from './commons/env';
import {isEmpty, omit} from 'lodash';
import dotenv from 'dotenv';
import moment from 'moment';
import flatten from 'flat';
import _ from 'lodash';
import {delay} from './commons/delay';

type BigQuerySchemaTypes =
	| 'string'
	| 'integer'
	| 'float'
	| 'boolean'
	| 'timestamp';

type SchemaRecord = {
	[n: string]: BigQuerySchemaTypes | SchemaRecord;
};

interface WinstonBigQueryOptions {
	dataset: string;
	table: string;
	applicationCredentials?: string;
	schema?: SchemaRecord;
	create?: boolean;
	timeout?: number;
}

export class WinstonBigQuery extends Transport {
	bigquery: BigQuery;
	options: WinstonBigQueryOptions;

	private isInitialized: boolean;

	constructor(options: WinstonBigQueryOptions) {
		super();
		dotenv.config();

		this.options = _.extend(
			{},
			{
				create: false,
				schema: null,
				timeout: 20 * 1000
			},
			options
		);

		if (isEmpty(options.dataset)) {
			throw new Error("Missing required 'datasetId' in construction");
		}

		if (isEmpty(options.table)) {
			throw new Error("Missing required 'tableId' in construction");
		}

		const envGoogleAppCred = env.getEnvVariable(
			'GOOGLE_APPLICATION_CREDENTIALS'
		);
		const envServiceAccount = env.getEnvVariable('SERVICE_ACCOUNT');
		const {applicationCredentials} = this.options;

		const credentialsJsonPath =
			applicationCredentials || envGoogleAppCred || envServiceAccount;

		if (env.isDevelopment() || env.isTest()) {
			console.log(`loading credentials from ${credentialsJsonPath}`);
		}

		this.bigquery = new BigQuery({
			keyFile: applicationCredentials
		});

		const {create} = this.options;

		if (create) {
			this.dropCreateTable().then(() => {
				this.isInitialized = true;
			});
		} else {
			this.isInitialized = true;
		}
	}

	async dropCreateTable() {
		const {dataset, table, schema} = this.options;

		const mandatorySchemaFields = {
			timestamp: 'timestamp',
			level: 'string',
			message: 'string'
		};

		const userSchemaFields = flatten(
			omit(schema, Object.keys(mandatorySchemaFields)),
			{
				delimiter: '_'
			}
		);

		const mergedSchema = Object.entries({
			...mandatorySchemaFields,
			...userSchemaFields
		})
			.map(([name, type]) => `${name}:${type}`)
			.join(',');

		await this.bigquery.dataset(dataset).createTable(table, {
			schema: mergedSchema as any
		});
	}

	async log(info: any, next?: () => void) {
		const {dataset, table, timeout} = this.options;

		if (!this.isInitialized) {
			await delay(timeout);

			if (!this.isInitialized)
				throw new Error(
					`connection is not initialized after ${timeout}ms , consider increasing 'timeout' option`
				);
		}

		const flatInfo = flatten(
			{
				timestamp: moment()
					.utc()
					.format(),
				...info
			},
			{
				delimiter: '_'
			}
		);

		const r = await this.bigquery
			.dataset(dataset)
			.table(table)
			.insert(flatInfo);

		next();
	}
}
