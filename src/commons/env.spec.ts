import env from './env';

describe('env.ts', () => {
	beforeEach(() => {
		env.setEnvironment('development');
	});

	describe('#isDevelopment', () => {
		it(`should inject 'development' as a default NODE_ENV`, () => {
			expect(env.isDevelopment()).toBeTruthy();
		});
	});

	describe('#isProdcution', () => {
		beforeEach(() => {
			process.env.NODE_ENV = 'production';
		});

		it(`should work for production env`, () => {
			expect(env.isProduction()).toBeTruthy();
		});
	});

	describe('#setEnviroment', () => {
		beforeEach(() => {
			process.env.NODE_ENV = null;
		});

		it(`should set NODE_ENV correctly`, () => {
			env.setEnvironment('ci');
			expect(env.isCI()).toBeTruthy();
		});
	});
});
