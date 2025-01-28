import request from 'supertest'
import { testServer } from '../../test-server';
import { prisma } from '../../../src/data/postgres';


describe('todos.routes.ts testing', () => {

    beforeAll(async() => {
        // Antes de nada, debemos levantar el server o las peticiones nos darán error
        await testServer.start();
    });

    afterAll(async () => {
        // Después de cada test, cerramos los listeners del servidor de express
        await testServer.close();
    });

    beforeEach(async() => {
        await prisma.todo.deleteMany();
    })

    const todo1 = { description: 'Create todo 1'};
    const todo2 = { description: 'Hola Mundo 2'};

    test('should return TODOs /api/todos', async () => {

        await prisma.todo.createMany({
            data: [
                todo1, todo2
            ]
        });
       
        /*
            * Necesitamos pasar un app de express al request de supertest
            * - Para ello hemos creado un server para testeo y hemos indicado como publico el app en el server
        */
        const { body } = await request(testServer.app)
            .get('/api/todos')
            .expect(200);

            // console.log(body);
        expect(body).toBeInstanceOf(Array);
        
        expect(body.length).toBe(2);
        expect(body[0].description).toBe(todo1.description);
        expect(body[0].completedAt).toBeNull();
        expect(body[1].description).toBe(todo2.description);
        expect(body[1].completedAt).toBeNull();
    });

    test('should return a TODO api/todos/:id', async() => {
        
        const todo = await prisma.todo.create({
            data: todo1
        });

        const { body } = await request(testServer.app)
            .get(`/api/todos/${todo.id}`)
            .expect(200)

        expect(body).toEqual({
            id: todo.id,
            description: todo.description,
            completedAt: todo.completedAt,
        })
    });
    
    test('should return a 404 NotFound api/todos/:id ', async () => {
        
        const todoId = 999;
        const {body} = await request(testServer.app)
            .get(`/api/todos/${todoId}`)
            .expect(404)
        
        expect(body).toEqual({error: `Todo with ${todoId} not Found`})

    });

    test('should return a new a TODO /api/todos', async () => {
        
        const { body } = await request(testServer.app)
            .post('/api/todos')
            .send(todo1)
            .expect(201)

        expect(body).toEqual({
            id: expect.any(Number),
            description: todo1.description,
            completedAt: null,
        });

    });

    test('should return an error if description is empty /api/todos', async () => {
        
        const { body } = await request(testServer.app)
            .post('/api/todos')
            .send({ })
            .expect(400)

        expect(body).toEqual({ error: expect.any(String) })

    });

    test('should return an error if description is not present /api/todos', async () => {
        
        const { body } = await request(testServer.app)
            .post('/api/todos')
            .send({ description: ''})
            .expect(400)

        expect(body).toEqual({ error: expect.any(String) })

    });

    // Prueba de que actualizamos un TOD que exista
    test('should return an updated TODO /api/todos/:id', async() => {
        
        const todo = await prisma.todo.create({
            data: todo1
        });

        const { body } = await request(testServer.app)
            .put(`/api/todos/${todo.id}`)
            .send({
                description: 'Todo updated test',
                completedAt: "2015-01-27"
            })
            .expect(200);
        
        expect(body.description).not.toBe(todo1.description);
        expect(body.completedAt).not.toBeNull();
        expect(body).toEqual({
            id: expect.any(Number),
            description: "Todo updated test",
            completedAt: "2015-01-27T00:00:00.000Z"
        })

    });

    test('should return an updated TODO only the date /api/todos/:id', async() => {
        
        const todo = await prisma.todo.create({
            data: todo1
        });

        const { body } = await request(testServer.app)
            .put(`/api/todos/${todo.id}`)
            .send({
                completedAt: "2015-01-27"
            })
            .expect(200);
        
        expect(body.description).toBe(todo1.description);
        expect(body.completedAt).toBe('2015-01-27T00:00:00.000Z');

    });

    test('should return an updated TODO only the description /api/todos/:id', async() => {
        
        const todo = await prisma.todo.create({
            data: todo1
        });

        const { body } = await request(testServer.app)
            .put(`/api/todos/${todo.id}`)
            .send({
                description: 'Todo updated test',
            })
            .expect(200);
        
        expect(body.description).toBe('Todo updated test');
        expect(body.completedAt).toBeNull();

    });

    // TODO: realizar la operación con errores personalizados
    test('should return 404 if not found on update TODO', async () => {
        
        const testId = 1234567;

        const { body } = await request(testServer.app)
            .put(`/api/todos/${testId}`)
            .send({
                description: 'Some fake description to update'
            })
            .expect(404)
        
            expect(body).toEqual({ error: `Todo with ${testId} not Found` });

    });
    

    test('should delete a TODO /api/todos/:id', async() => {
        
        const todo = await prisma.todo.create({
            data: todo1
        });

        const { body } = await request(testServer.app)
            .delete(`/api/todos/${todo.id}`)
            expect(200);

        expect(body).toEqual(todo);

        await request(testServer.app)
            .get(`/api/todos/${body.id}`)
            .expect(404);
    });

    test('should return 404 if TODO is not found', async () => {

        const testId = 2134444667;

        const { body } = await request(testServer.app)
            .delete(`/api/todos/${testId}`)
            .expect(404);

        expect(body).toEqual({ error: `Todo with ${testId} not Found` });
        
    });
     
});
