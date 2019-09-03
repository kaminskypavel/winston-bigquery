import jsend from 'jsend';
import {Request, Response} from 'express';

export const rootController = (req: Request, res: Response) => {
	res.send(jsend.success('this is a demo controller'));
};

export const qsRootController = (req: Request, res: Response) => {
	res.send(jsend.success(`Hello ${req.query.name}`));
};
