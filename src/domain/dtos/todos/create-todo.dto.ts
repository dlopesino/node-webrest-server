export class CreateTodoDto {

    /*
        Creamos un constructor privado hace que sólo se va a poder llamar dentro de nuestra clase
    */
    private constructor(
        public readonly description: string,
    ) {}

    // Retornamos un array que puede contener o un string indicando el error o una instancia del DTO
    static create(props: {[key:string]: any}): [string?, CreateTodoDto?] {

        // Primero validamos las properties
        const { description } = props;

        if (!description) return ['Description property is required', undefined]

        return [undefined, new CreateTodoDto(description)];
    }
}
