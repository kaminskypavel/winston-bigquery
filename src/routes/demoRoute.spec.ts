import request from 'supertest';
import app from '../app';

describe('GET /demo', function() {
	it('responds with json', async () => {
		const response = await request(app).get('/demo');
		expect(response.status).toBe(200);
		expect(JSON.parse(response.text)).toEqual({
			status: 'success',
			data: 'this is a demo controller'
		});
	});
});

describe('GET /demo/qs', function() {
	it('responds with a correct message', async () => {
		const response = await request(app).get('/demo/qs?name=Panda');
		expect(response.status).toBe(200);
		expect(JSON.parse(response.text)).toEqual({
			status: 'success',
			data: 'Hello Panda'
		});
	});

	it('responds an error message if name query string is missing', async () => {
		const response = await request(app).get('/demo/qs');
		expect(response.status).toBe(200);
		expect(JSON.parse(response.text)).toEqual(
			expect.objectContaining({
				status: 'error',
				message: 'validation error'
			})
		);
	});
});
