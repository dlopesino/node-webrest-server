// El código de las "entities" no está relacionado a la base de datos


export class TodoEntity {

    constructor(
        public id: number,
        public description: string,
        public completedAt?: Date|null
    ){}

    get isCompleted() {
        return !!this.completedAt;
    }

    public static fromObject (object: {[key: string]: any}): TodoEntity {
        const { id, description, completedAt } = object;
        // Protección para las personas que quieran usar nuestras entities
        if(!id) throw 'Id is required';
        if(!description) throw 'description Property is required';

        let newCompletedAt;
        if (completedAt) {
            newCompletedAt = new Date(completedAt)
            if(isNaN(newCompletedAt.getTime())) {
                throw 'completedAt is not a valid Date'
            }
        }

        return new TodoEntity(id, description, completedAt)
    }

    

}