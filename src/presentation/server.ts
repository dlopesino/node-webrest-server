import express, { Application, Router } from 'express'
import path from 'path'

interface Options {
    port: number
    routes: Router
    publicFolder?: string
}

export class Server {
    public readonly app: Application = express()
    private serverListener?: any
    private readonly routes: Router
    private readonly port: number
    private readonly publicFolder: string

    constructor(options: Options) {
        const { port, routes, publicFolder = 'public' } = options
        this.port = port
        this.routes = routes
        this.publicFolder = publicFolder
    }

    async start() {
        //* Middlewares
        /*
            * Los middlewares son funciones que se ejecutan al pasar por una ruta
            Para que realmente nosotros podamos regresar o tener un REST Server significa que no sotros 
            estaríamos regresando algún tipo de información en algún formato como XML, JSOn 
            o algo que nos permita a nosotros hacer un llamado a algún endpoint
        */
        /* 
            Aplicamos la serialización de nuestras peticiones
            * cualquier petición que contenga body, al pasar por aqui lo serializará como un json
        */
        this.app.use(express.json())

        // El siguiente middleware nos va a permitir x-www-form-urlencoded
        this.app.use(express.urlencoded({ extended: true }))

        //* Routes
        this.app.use(this.routes)

        //* Public Folder
        /* Configuramos la ruta a la carpeta publica de la SPA */
        this.app.use(express.static(this.publicFolder))

        // * SPA Routing
        /* 
            El siguiente código significa, todas las peticiones
            que no encajen con public pasarán por aqui
        */
        this.app.get('*', (req, res) => {
            /*
                Lo que vamos a hacer aqui es retornar la ruta a nuestro index que tenemos en nuestra carpeta 'public'
                pero tiene que ser un path absoluto
            */
            /* 
                salimos al root del directorio y concatenamos con el index.html de la carpeta 'public'
                para que no de error en las rutas al refrescar la página 
                NOTA: En este caso react router ya toma el control de las rutas para servirnos la SPA
                */
            const indexPath = path.join(
                __dirname + `../../../${this.publicFolder}/index.html`,
            )
            // console.log(indexPath);
            res.sendFile(indexPath)
        })

        // El puerto siempre debe venir de una variable de entorno
        this.serverListener = this.app.listen(this.port, () => {
            console.log(`Server Running on port ${this.port}`)
        })

    }

    public close() {
        this.serverListener?.close();
    }
}
