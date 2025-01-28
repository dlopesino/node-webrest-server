import { Response } from 'express';
import { HttpError } from './http-error';
import { STATUS } from './http-status-codes';

// * El error de tipo unknown es debido a que puede ser una excepción lanzada por cualquier punto de mi aplicación
export function handleHttpError(error: unknown, res: Response) {
    if (error instanceof HttpError) {
        return res.status(error.statusCode).json({error: error.message});
    }
    // Grabar log (El suceso no estaba contemplado)
    return res.status(STATUS.SERVER_ERROR.INTERNAL).json({error: 'Internal Server Error'});
}