import { envs } from '../src/config/envs';
import { Server }  from '../src/presentation/server';

jest.mock('../src/presentation/server');
/*
    * Con esto indicamos que todo lo que se encuentre en esa importación es un mock
*/

describe('Testing App.ts', () => {

    test('should call server with arguments and start', async () => {

        // * Esta línea es para 'invocar' el app.ts que es el que ejecuta el server
        await import('../src/app');

        // * Testeamos que el server se llame una sola vez
        expect(Server).toHaveBeenCalledTimes(1);

        // * testeamos que el server se haya instamciado con un objeto y sus argumentos correspondientes
        expect(Server).toHaveBeenCalledWith({
            port: envs.PORT,
            publicFolder: envs.PUBLIC_FOLDER,
            routes: expect.any(Function) // * con que indiquemos que haya sido con cualquier función nos vale
        });

        // * Comprobamos que la función start del server se haya llamado, y ademas haya sido sin ningún argumento
        expect(Server.prototype.start).toHaveBeenCalledWith();

        
    });
    
});
