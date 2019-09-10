import _ from 'lodash';

process.env.NODE_ENV = _.get(process.env, 'NODE_ENV', 'development');

const isDevelopment = (): boolean => process.env.NODE_ENV === 'development';

const isCI = (): boolean => process.env.NODE_ENV === 'ci';

const isTest = (): boolean => process.env.NODE_ENV === 'test';

const isProduction = (): boolean => process.env.NODE_ENV === 'production';

const setEnvVariable = (name: string, value: string) =>
	(process.env[name] = value);

const unsetEnvVariable = (name: string) => setEnvVariable(name, null);

const getEnvVariable = (name: string) => process.env[name];

type EnvName = 'production' | 'development' | 'ci' | 'test';

const getEnvironment = (): EnvName =>
	(process.env.NODE_ENV as EnvName) || 'development';

const setEnvironment = (envName: EnvName) =>
	setEnvVariable('NODE_ENV', envName);

export default {
	isProduction,
	isCI,
	isDevelopment,
	isTest,
	getEnvironment,
	setEnvironment,
	setEnvVariable,
	getEnvVariable,
	unsetEnvVariable
};
