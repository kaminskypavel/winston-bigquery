import Transport from 'winston-transport';
import {BigQuery, TableMetadata} from '@google-cloud/bigquery';
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

type BigQueryTableSchema = {
	[n: string]: BigQuerySchemaTypes | BigQueryTableSchema;
};

interface WinstonBigQueryOptions extends Transport.TransportStreamOptions {
	dataset: string;
	table: string;
	applicationCredentials?: string;
	bigquery?: BigQuery;
	schema?: BigQueryTableSchema;
	create?: boolean;
	timeout?: number;
}

export class WinstonBigQuery extends Transport {
	bigquery: BigQuery;
	options: WinstonBigQueryOptions;
	schema: BigQueryTableSchema;

	private isInitialized: boolean;

	constructor(options: WinstonBigQueryOptions) {
		super(options);
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

		if (options.bigquery) {
			this.bigquery = options.bigquery;
		} else {
			if (env.isDevelopment() || env.isTest()) {
				console.log(`loading credentials from ${credentialsJsonPath}`);
			}

			this.bigquery = new BigQuery({
				keyFile: applicationCredentials
			});
		}

		const {create} = this.options;

		if (create) {
			this.createTable().then(() => {
				this.isInitialized = true;
			});
		} else {
			this.isInitialized = true;
		}
	}

	async getTableSchema() {
		const {dataset, table} = this.options;

		const meta: TableMetadata = (
			await this.bigquery
				.dataset(dataset)
				.table(table)
				.getMetadata()
		)[0] as unknown;

		const schema = meta.schema.fields.reduce(
			(
				acc: {[key: string]: string},
				{name, type}: {name: string; type: string}
			) => {
				acc[name] = type.toLowerCase();
				return acc;
			},
			{}
		);
		return schema;
	}

	async createTable() {
		const {dataset, table, schema} = this.options;

		const mandatorySchemaFields = {
			timestamp: 'timestamp',
			level: 'string',
			message: 'string',
			meta: 'string'
		};

		const userSchemaFields: any = flatten(
			omit(schema, Object.keys(mandatorySchemaFields)),
			{
				delimiter: '_'
			}
		);

		const mergedSchema = {
			...mandatorySchemaFields,
			...userSchemaFields
		};

		const shorthandMergedSchema = Object.entries(mergedSchema)
			.map(([name, type]) => `${name}:${type}`)
			.join(',');

		this.schema = mergedSchema as BigQueryTableSchema;

		await this.bigquery.dataset(dataset).createTable(table, {
			schema: shorthandMergedSchema as any
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

		if (!this.schema) {
			const schema = await this.getTableSchema();
			this.options.schema = schema as BigQueryTableSchema;
		}

		const flatInfo: {[key: string]: string} = flatten(
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

		const schemaFields = _.pick(flatInfo, Object.keys(this.options.schema));
		const metaField = _.omit(flatInfo, Object.keys(this.options.schema));

		const flatNormalizedInfo = {
			...schemaFields,
			meta: _.isEmpty(metaField) ? null : JSON.stringify(metaField)
		};

		const r = await this.bigquery
			.dataset(dataset)
			.table(table)
			.insert(flatNormalizedInfo);

		next();
	}
}
