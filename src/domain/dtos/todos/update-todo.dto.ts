

export class UpdateTodoDto {

    private constructor(
        public readonly id: number,
        public readonly description?: string,
        public readonly completedAt?: Date
    ){}

    get values() {
        const returnObj: {[key: string]: any} = {}

        if (this.description) returnObj.description = this.description;
        if (this.completedAt) returnObj.completedAt = this.completedAt;
        return returnObj
    }

    static create(props: {[key:string]: any}): [string?, UpdateTodoDto?] {

        const { id, description, completedAt } = props
        let newCompletedAt = completedAt;

        if (!id || isNaN(Number(id))) return ['Id property must be a valid number', undefined]

        if (completedAt) {
            newCompletedAt = new Date(completedAt)
            if (newCompletedAt.toString() === 'Invalid Date') {
                return ['completedAt property must be a valid date', undefined]
            }
        }



        return [undefined, new UpdateTodoDto(id, description, newCompletedAt)]
    }

}