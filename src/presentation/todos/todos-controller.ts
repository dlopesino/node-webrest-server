import { Request, Response } from 'express';
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos';
import { CreateTodo, DeleteTodo, GetTodo, GetTodos, TodoRepository, UpdateTodo } from '../../domain';
import { handleHttpError, STATUS } from '../../domain/errors';

export class TodosController {
    /* 
        En los controladores nos interesa hacer la inyección de dependencias
        Ejemplo: Inyectar un repositorio para que nuestras rutas hagan uso de esa logica
        * O mejor aún, inyectar el repositorio para poder implementar y usarlo mediante casos de uso
    */

    constructor(
        private readonly todoRepository: TodoRepository,
    ) {}

    /*
        * Ejecutamos la función con then porque express "recomienda" no utilizar funciones asincronas

    */
    public getTodos = (req: Request, res: Response) => {
        
        new GetTodos(this.todoRepository)
        .execute()
        .then(todos => res.json(todos))
        .catch( error => handleHttpError(error, res));
    }

    public getTodoById = (req: Request, res: Response) => {
        // Extraemos el id de los query params
        //* +id convierte a number
        const id = +req.params.id;

        new GetTodo(this.todoRepository)
            .execute(id)
            .then(todo => res.json(todo))
            .catch(error => handleHttpError(error, res));
    }

    // POST
    public createTodo = (req: Request, res: Response) => {
        // CreateTodoDto tiene su validación de los elementos que recibe en el body
        const [error, createTodoDto] = CreateTodoDto.create(req.body);
        if (error) return res.status(STATUS.CLIENT_ERROR.BAD_REQUEST).json({error});

        /* 
            * La exclamación es para indicarle al compilador que si tengo el objeto, ya he hecho la comprobación
            * en el if anterior con el error, ya que mi objeto si no envia error, envía el DTO
        */
        new CreateTodo(this.todoRepository)
            .execute(createTodoDto!)
            .then(todo => res.status(STATUS.SUCCESS.CREATED).json(todo))
            .catch(error => handleHttpError(error, res))
            // centralizamos la logica del control de errores
    }

    // PUT
    public updateTodo = (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateTodoDto ] = UpdateTodoDto.create({...req.body, id});
        if (error) return res.status(STATUS.CLIENT_ERROR.BAD_REQUEST).json({error});

        new UpdateTodo(this.todoRepository)
            .execute(updateTodoDto!)
            .then(todo => res.status(STATUS.SUCCESS.OK).json(todo))
            .catch(error => handleHttpError(error, res));
    }

    // DELETE
    public deleteTodo = (req: Request, res: Response) => {
        const id = +req.params.id;

        new DeleteTodo(this.todoRepository)
            .execute(id)
            .then(todo => res.status(STATUS.SUCCESS.OK).json(todo))
            .catch(error => handleHttpError(error, res));
    }
}
