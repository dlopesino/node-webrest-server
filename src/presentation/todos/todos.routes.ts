import { Router } from 'express'
import { TodosController } from './todos-controller'
import { TodoDatasourceImpl } from '../../infraestructure/datasource/todo.datasource.impl'
import { TodoRepositoryImpl } from '../../infraestructure/repositories/todo.repository.impl'

export class TodosRoutes {
    static get routes(): Router {
        const router = Router()

        /*
            * Para poder usar los metodos del datasource en el Controller
            * 1) creamos un objeto de la implementación del datasource
            * 2) creamos un objeto de la implementación del repository
            *   - Le inyectamos el datasource para que pueda acceder a los metodos que llamana a la base de datos
            * 3) creamos un objeto del controller en el que inyectamos la implementación
            *    del repository ya cargado con el datasource correspondiente, para poder ejecutar las funciones
            *    del CRUD en nuestras rutas
            * ** NOTA: Previamente debemos haber indicado en el constructor de cada uno de los
            *    elementos la inyección de dependencias correspondiente.
        */
        const datasource = new TodoDatasourceImpl() // podría ser el datasource de postgress, mongo etc
        const todoRepository = new TodoRepositoryImpl(datasource)
        const todosController = new TodosController(todoRepository)


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
