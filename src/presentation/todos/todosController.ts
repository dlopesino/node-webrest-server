import { Request, Response } from 'express'

interface Todo {
    id: number
    description: string
    completedAt: Date | null
}

let todos: Todo[] = [
    {
        id: 1,
        description: 'Recolectar la piedra del Alma',
        completedAt: new Date(),
    },
    {
        id: 2,
        description: 'Recolectar la piedra del Tiempo',
        completedAt: new Date(new Date().getTime() * 1.5),
    },
    {
        id: 3,
        description: 'Recolectar la piedra de la Realidad ',
        completedAt: new Date(new Date().getTime() * 2),
    },
]

export class TodosController {
    /* 
        En los controladores nos interesa hacer la inyección de dependencias
        Ejemplo: Inyectar un repositorio para que nuestras rutas hagan uso de esa logica
        * O mejor aún, inyectar el repositorio para poder implementar y usarlo mediante casos de uso
    */

    constructor() {}

    public getTodos = (req: Request, res: Response) => {
        return res.json(todos)
    }

    public getTodoById = (req: Request, res: Response) => {
        console.log(req.params)
        const id = +req.params.id

        // Cuando nos envian parámetros en formato erróneo es común enviar status 400 Bad Request
        if (isNaN(id))
            return res
                .status(400)
                .json({ error: 'ID argument must be a number' })

        //* +id convierte a number
        const todo = todos.find((todo) => todo.id === id)

        if (todo) return res.json(todo)

        return res.status(404).json({ error: `Todo with ${id} not Found` })
    }

    // POST
    public createTodo = (req: Request, res: Response) => {
        const { description } = req.body

        if (!description) {
            return res
                .status(400)
                .json({ error: 'Description property is required' })
        }

        const newTodo = {
            id: new Date().getTime(),
            completedAt: null,
            description,
        }
        todos.push(newTodo)

        res.status(201).json(newTodo)
    }

    // PUT
    public updateTodo = (req: Request, res: Response) => {
        const id = +req.params.id

        // Cuando nos envian parámetros en formato erróneo es común enviar status 400 Bad Request
        if (isNaN(id)) {
            return res
                .status(400)
                .json({ error: 'ID argument must be a number' })
        }

        // En javascript, cuando trabajamos con objetos, esos objetos pasan por referencia
        const todo = todos.find((todo) => todo.id === id)
        if (!todo) {
            return res
                .status(404)
                .json({ error: `Todo with Id ${id} not found` })
        }

        const { description, completedAt } = req.body

        // if (!description) {
        //     return res
        //         .status(400)
        //         .json({ error: 'Description property is required' })
        // }

        //! OJO, referencia
        // En javascript, no deberíamos actualizar directamente la referencia
        // No deberíamos mutar la información
        // todo.description = description

        todo.description = description || todo.description
        completedAt === 'null'
            ? (todo.completedAt = null)
            : (todo.completedAt = new Date(completedAt) || todo.completedAt)

        return res.status(200).json({ todo })
    }

    // DELETE
    public deleteTodo = (req: Request, res: Response) => {
        const id = +req.params.id

        if (isNaN(id)) {
            return res
                .status(400)
                .json({ error: 'ID argument must be a number' })
        }

        const todo = todos.find((todo) => todo.id === id)
        if (!todo) {
            return res
                .status(404)
                .json({ error: `Todo with Id ${id} not found` })
        }
        /*
         * Splice nos permite eliminar elementos de un array indicando el indice del elemento a remover
         * como primer parámetro y el segundo parámetro el número de posiciones a eliminar
         * incluyendo la actual, en este caso sólo eliminamos el que coincide con nuestro "todo"
             todos.splice(todos.indexOf(todo), 1)
         */
        todos = todos.filter((todo) => todo.id !== id)

        return res.status(200).json({ todos })
    }
}
