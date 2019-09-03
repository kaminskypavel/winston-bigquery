import {WinstonBigQuery} from './index';

describe('WinstonBigQuery', () => {
	describe('#constructior', () => {
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
});
