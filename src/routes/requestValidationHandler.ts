import {validationResult} from 'express-validator';
import {Request, Response} from 'express';

export const requestValidationHandler = (
	req: Request,
	res: Response,
	next: any
) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.jsend.error({
			message: 'validation error',
			data: errors.array()
		});
	}

	next();
};
