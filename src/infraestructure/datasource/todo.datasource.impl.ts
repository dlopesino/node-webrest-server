import { prisma } from '../../data/postgres';
import { 
    CreateTodoDto,
    TodoDatasource,
    TodoEntity,
    UpdateTodoDto,
    HttpError,
    STATUS
} from '../../domain';

export class TodoDatasourceImpl implements TodoDatasource {

    async create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
        const created = await prisma.todo.create({
            data: createTodoDto,
        });
        if (!created) throw new HttpError(STATUS.CLIENT_ERROR.BAD_REQUEST, 'Failed to create record in the database');
        return TodoEntity.fromObject(created);
    }
    async getAll(): Promise<TodoEntity[]> {
        const todos = await prisma.todo.findMany()
        if (!todos) throw new HttpError(STATUS.CLIENT_ERROR.BAD_REQUEST, 'Bad Request')
        return todos.map(todo => TodoEntity.fromObject(todo));
    }
    async findById(id: number): Promise<TodoEntity> {
        
        if (isNaN(id)) throw new HttpError(STATUS.CLIENT_ERROR.BAD_REQUEST, 'ID argument must be a number');
        
        const todo = await prisma.todo.findFirst({
            where: {
                id,
            },
        })
        
        if (!todo) throw new HttpError(STATUS.CLIENT_ERROR.NOT_FOUND, `Todo with ${id} not Found`);
        return TodoEntity.fromObject(todo)
    }
    async updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
        await this.findById(updateTodoDto.id);
        const updated = await prisma.todo.update({
            where: { id: updateTodoDto.id },
            data: updateTodoDto!.values
        })
        return TodoEntity.fromObject(updated)
    }
    async deleteById(id: number): Promise<TodoEntity> {
        await this.findById(id);
        const deleted = await prisma.todo.delete({ where: { id } });
        return TodoEntity.fromObject(deleted);
    }

}