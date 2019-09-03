import request from 'supertest';
import app from '../app';

describe('GET /', () => {
	it('responds with json', async () => {
		const response = await request(app).get('/');
		expect(response.status).toBe(200);
		expect(JSON.parse(response.text)).toEqual({
			status: 'success',
			data: 'ok'
		});
	});

	it('responds with error for unknown path', async () => {
		const response = await request(app).get('/this does not exist');
		expect(response.status).toBe(200);
		expect(JSON.parse(response.text)).toEqual({
			status: 'error',
			message: 'invalid route'
		});
	});
});
