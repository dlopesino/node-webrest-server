import { Router } from 'express'
import { TodosRoutes } from './todos/todos.routes'

export class AppRoutes {
    static get routes(): Router {
        const router = Router()

        /* 
            * Este archivo se mostrarán las rutas base disponibles de nuestra aplicación, api
            - api/todos
            - api/users 
            - api/auth 
            - api/...
        */
        /* 
            esto es un middleware que se ejecuta cuando pase la ruta por aqui
            * En caso de que en un futuro se cambie la ruta base, el cambio estará centralizado
            por ejemplo:
                cambia la base '/api/todos' por '/api/v2/todos' las rutas internas no se verán afectadas
        */
        router.use('/api/todos', TodosRoutes.routes)

        return router
    }
}
