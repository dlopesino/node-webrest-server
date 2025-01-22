import { Router } from 'express'
import { TodosController } from './todosController'

export class TodosRoutes {
    static get routes(): Router {
        const router = Router()

        const todosController = new TodosController()
        //* Aquí manejamos las peticiones específicas de las rutas (ejemplo: CRUD)
        //* Este archivo es el que crecerá en cuanto a rutas específicas
        /*  
            sólo mandamos la referencia a la función
            asumimos que a la ruta que me manda mi 
            middleware(api/todos en este caso) este es mi punto de entrada ('/')

        */
        router.get('/', todosController.getTodos)
        router.get('/:id', todosController.getTodoById)
        router.post('/', todosController.createTodo)
        router.put('/:id', todosController.updateTodo)
        router.delete('/:id', todosController.deleteTodo)

        return router
    }
}
