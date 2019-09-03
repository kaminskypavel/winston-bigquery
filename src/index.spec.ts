jest.mock('@google-cloud/bigquery');
import {BigQuery} from '@google-cloud/bigquery';
import {WinstonBigQuery} from './index';

describe('WinstonBigQuery', () => {
	describe('#constructor', () => {
		it('should verify datasetId is set', () => {
			const options = {tableId: 'tableId'} as any;
			expect(() => new WinstonBigQuery(options)).toThrow(
				"Missing required 'datasetId' in construction"
			);
		});

		it('should verify tableId is set', () => {
			const options = {datasetId: 'datasetId'} as any;
			expect(() => new WinstonBigQuery(options)).toThrow(
				"Missing required 'tableId' in construction"
			);
		});

		it('should verify GOOGLE_APPLICATION_CREDENTIALS is set', () => {
			const options = {datasetId: 'datasetId', tableId: 'tableId'} as any;
			expect(() => new WinstonBigQuery(options)).toThrow(
				/Missing required GOOGLE_APPLICATION_CREDENTIALS/
			);
		});
	});

	describe('#log', () => {
		process.env['GOOGLE_APPLICATION_CREDENTIALS'] = 'whatever';
		const logger = new WinstonBigQuery({
			tableId: 'tableId',
			datasetId: 'dataseId'
		});

		beforeEach(() => {
			jest.resetAllMocks();
		});

		it('should call the right dataset in bigquery', () => {
			logger.log({
				message: 'this is a Hello World',
				meta1: 1,
				meta2: 'string',
				meta3: {deepObj: 1}
			});
			const a = new BigQuery();
			expect(logger.bigquery.dataset).toHaveBeenCalledWith('dataseId');
		});
	});
});
