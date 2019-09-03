import {isDevelopment, isProduction} from './env';

describe('env.ts', () => {
	describe('#isDevelopment', () => {
		beforeEach(() => {
			process.env.NODE_ENV = 'development';
		});
		it(`should inject 'isDevelopment' as a default NODE_ENV`, () => {
			expect(isDevelopment()).toBeTruthy();
		});
	});

	describe('#isProdcution', () => {
		beforeEach(() => {
			process.env.NODE_ENV = 'production';
		});

		it(`should work for production env`, () => {
			expect(isProduction()).toBeTruthy();
		});
	});
});
