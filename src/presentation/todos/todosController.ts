import { Request, Response } from 'express'
import { prisma } from '../../data/postgres'
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos'

export class TodosController {
    /* 
        En los controladores nos interesa hacer la inyección de dependencias
        Ejemplo: Inyectar un repositorio para que nuestras rutas hagan uso de esa logica
        * O mejor aún, inyectar el repositorio para poder implementar y usarlo mediante casos de uso
    */

    constructor() {}

    public getTodos = async (req: Request, res: Response) => {
        const todos = await prisma.todo.findMany()
        return res.json(todos)
    }

    public getTodoById = async (req: Request, res: Response) => {
        // Extraemos el id de los query params
        //* +id convierte a number
        const id = +req.params.id

        // Cuando nos envian parámetros en formato erróneo es común enviar status 400 Bad Request
        if (isNaN(id))
            return res
                .status(400)
                .json({ error: 'ID argument must be a number' })

        const todo = await prisma.todo.findFirst({
            where: {
                id,
            },
        })

        if (todo) return res.json(todo)

        return res.status(404).json({ error: `Todo with ${id} not Found` })
    }

    // POST
    public createTodo = async (req: Request, res: Response) => {

        const [error, createTodoDto] = CreateTodoDto.create(req.body)

        if (error) return res.status(400).json({error})

        /* 
            * La exclamación es para indicarle al compilador qu esi tengo el objeto, ya he hecho la comprobación
            * en el if anterior con el error, ya que mi objeto si no envia error, envía el DTO
        */
        const created = await prisma.todo.create({
            data: createTodoDto!,
        })
        
        res.status(201).json(created)
    }

    // PUT
    public updateTodo = async (req: Request, res: Response) => {
        const id = +req.params.id

        const [error, updateTodoDto ] = UpdateTodoDto.create({...req.body, id})

        if (error) return res.status(400).json({error})

        // En javascript, cuando trabajamos con objetos, esos objetos pasan por referencia
        // const todo = todos.find((todo) => todo.id === id)
        const todo = await prisma.todo.findFirst({
            where: {
                id,
            },
        })

        if (!todo) {
            return res
                .status(404)
                .json({ error: `Todo with Id ${id} not found` })
        }

        const updated = await prisma.todo.update({
            where: { id },
            data: updateTodoDto!.values
        })
        
        return res.status(200).json({ updated })
    }

    // DELETE
    public deleteTodo = async (req: Request, res: Response) => {
        const id = +req.params.id

        if (isNaN(id)) {
            return res
                .status(400)
                .json({ error: 'ID argument must be a number' })
        }

        // const todo = todos.find((todo) => todo.id === id)
        const todo = await prisma.todo.findFirst({
            where: {
                id,
            },
        })
        if (!todo) {
            return res
                .status(404)
                .json({ error: `Todo with Id ${id} not found` })
        }
        const deleted = await prisma.todo.delete({ where: { id } })

        return res.status(200).json({ deleted })
    }
}
