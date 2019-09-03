import _ from 'lodash';

process.env.NODE_ENV = _.get(process.env, 'NODE_ENV', 'development');

export const isDevelopment = (): boolean => {
	return process.env.NODE_ENV === 'development';
};

export const isCI = (): boolean => {
	return process.env.NODE_ENV === 'ci';
};

export const isTest = (): boolean => {
	return process.env.NODE_ENV === 'ci';
};

export const isProduction = (): boolean => {
	return process.env.NODE_ENV === 'production';
};

export const isEnableMonitoring = (): boolean => {
	return process.env.ENABLE_MONITORING === 'true';
};

export const isEnableSwagger = (): boolean => {
	return process.env.ENABLE_SWAGGER === 'true';
};
