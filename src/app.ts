import { Server } from "./presentation/server";
import { envs } from "./config/envs";


(() => {
    main();
})();

function main() {

    const options = {
        port: envs.PORT,
        publicFolder: envs.PUBLIC_FOLDER
    }
    const server = new Server(options)
    server.start()
}