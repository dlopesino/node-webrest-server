import { Server } from './presentation/server';
import { envs } from './config/envs';
import { AppRoutes } from './presentation/app.routes';

// Función autoinvocada que llama al main
;(() => {
    main()
})()

// main: crea una instancia del Server
function main() {
    /*
        * Para los tests, necesito crear la instancia y que hay asido creado con los argumentos que estoy esperando
        * - Sólo necesitamos probar que nuestro 'main' haya sido llamado con los métodos que nosotros estamos esperando
    */
    const server = new Server({
        port: envs.PORT,
        routes: AppRoutes.routes, // Getter estático de nuestras rutas
        publicFolder: envs.PUBLIC_FOLDER,
    })
    // El servidor llama al starter
    server.start()
}
