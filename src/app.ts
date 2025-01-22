import { Server } from './presentation/server'
import { envs } from './config/envs'
import { AppRoutes } from './presentation/app.routes'
;(() => {
    main()
})()

function main() {
    const options = {
        port: envs.PORT,
        routes: AppRoutes.routes,
        publicFolder: envs.PUBLIC_FOLDER,
    }
    const server = new Server(options)
    server.start()
}
