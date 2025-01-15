import express from "express";
import path from "path";

interface Options {
    port: number;
    publicFolder?: string;
}

export class Server {
    private app = express()
    private readonly port: number;
    private readonly publicFolder: string

    constructor(options: Options){
        const {port, publicFolder = 'public'} = options;
        this.port = port;
        this.publicFolder = publicFolder;
    }

    async start() {

        //* Middlewares
        // Los middlewares no son mas que funciones que se ejecutan al pasar por una ruta

        //* Public Folder
        this.app.use(express.static(this.publicFolder))

        // * Routing
        // El siguiente código significa, todas las peticiones que no encajen con public pasarán por aqui
        this.app.get('*', (req, res) => {
            /*
                Lo que vamos a hacer aqui es retornar la ruta a nuestro index que tenemos en nuestra carpeta "public"
                pero tiene que ser un path absoluto
            */
            /* 
                salimos al root del directorio y concatenamos con el index.html de la carpeta "public"
                para que no de error en las rutas al refrescar la página 
                NOTA: En este caso react router ya toma el control de las rutas para servirnos la SPA
                */
            const indexPath = path.join(__dirname + `../../../${this.publicFolder}/index.html`)
            // console.log(indexPath);
            res.sendFile(indexPath)
        })

        // El puerto siempre debe venir de una variable de entorno
        this.app.listen(this.port, () => {
            console.log(`Server Running on port ${this.port}`);
            
        })
        
    }

}