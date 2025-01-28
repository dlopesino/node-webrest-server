import { Request, Response } from 'express';
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos';
import { TodoRepository } from '../../domain';
import { handleHttpError, STATUS } from '../../domain/errors';

export class TodosController {
    /* 
        En los controladores nos interesa hacer la inyección de dependencias
        Ejemplo: Inyectar un repositorio para que nuestras rutas hagan uso de esa logica
        * O mejor aún, inyectar el repositorio para poder implementar y usarlo mediante casos de uso
    */

    constructor(
        private readonly todoRepository: TodoRepository,
    ) {
       
    }

    public getTodos = async (req: Request, res: Response) => {
        const todos = await this.todoRepository.getAll();
        return res.json(todos)
    }

    public getTodoById = async (req: Request, res: Response) => {
        // Extraemos el id de los query params
        //* +id convierte a number
        const id = +req.params.id;

        try {
            const todo = await this.todoRepository.findById(id);
            return res.json(todo);
        } catch (error) {
            handleHttpError(error, res)
        }

    }

    // POST
    public createTodo = async (req: Request, res: Response) => {
        // CreateTodoDto tiene su validación de los elementos que recibe en el body
        const [error, createTodoDto] = CreateTodoDto.create(req.body);
        if (error) return res.status(STATUS.CLIENT_ERROR.BAD_REQUEST).json({error});
        /* 
            * La exclamación es para indicarle al compilador que si tengo el objeto, ya he hecho la comprobación
            * en el if anterior con el error, ya que mi objeto si no envia error, envía el DTO
        */
        try {
            const created = await this.todoRepository.create(createTodoDto!);
            return res.status(STATUS.SUCCESS.CREATED).json(created);
        } catch (error) {
            handleHttpError(error, res)
        }

    }

    // PUT
    public updateTodo = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateTodoDto ] = UpdateTodoDto.create({...req.body, id});
        if (error) return res.status(STATUS.CLIENT_ERROR.BAD_REQUEST).json({error});

        try {
            const updated = await this.todoRepository.updateById(updateTodoDto!);
            return res.status(STATUS.SUCCESS.OK).json({ updated });
        } catch (error) {
            handleHttpError(error, res)
        }
    }

    // DELETE
    public deleteTodo = async (req: Request, res: Response) => {
        const id = +req.params.id
        try {
            const deleted = await this.todoRepository.deleteById(id);
            return res.status(STATUS.SUCCESS.OK).json({ deleted })
        } catch (error) {
            handleHttpError(error, res)
        }
    }
}
