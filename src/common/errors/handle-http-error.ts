import { Response } from 'express';
import { HttpError } from './http-error';
import { STATUS } from '../http-status-codes';

export function handleHttpError(error: Error | unknown, res: Response) {
    if (error instanceof HttpError) {
        return res.status(error.statusCode).json({error: error.message});
    }
    return res.status(STATUS.SERVER_ERROR.INTERNAL).json({error: 'Internal Server Error'});
}