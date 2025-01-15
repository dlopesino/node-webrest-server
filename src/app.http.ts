import fs from 'fs';
// http  -> Lo tradicional que hemos estado utilizando muchos años.
// https -> ya tiene certificado SSL, el cual nos ayuda a que nuestros usuarios tengan encriptación punto punto
// http2 --> Es un nuevo protocolo más rápido, más eficiente. Soporta multiplex(Multiples solicitudes y respuestas a través de una única conexión TCP)
import http from 'http';


// Ejemplo de WebServer: estamos regresando contenido estático
// No es un API, ni estamos creando una interfaz para consumir datos
const server = http.createServer((req, res) => {

    // console.log(req.url);
    // res.writeHead(200, { 'Content-Type': 'text/html'});
    // res.write('<h1 style="color: blue">Hola Mundo</h1>');
    // res.end();
    
    // const data = { name: 'Jhon Doe', age: 30, city: 'New York'};
    // res.writeHead(200, { 'Content-Type': 'application/json'});
    // res.end(JSON.stringify(data));

    if (req.url === '/') {
        // const file = await req.url
        const htmlFile = fs.readFileSync('./public/index.html', 'utf-8')
        // const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;
        res.writeHead(200, { 'Content-Type': 'text/html'})
        res.end(htmlFile);
        return;
    }
    if (req.url?.endsWith('.js')) {
        res.writeHead(200, { 'Content-Type': 'application/javascript'})
    } else if (req.url?.endsWith('.css')){
        res.writeHead(200, { 'Content-Type': 'text/css'})

    }

    const responseContent = fs.readFileSync(`./public${req.url}`, 'utf-8')
    res.end(responseContent);

})

server.listen(8080, () => {
    console.log('Server is running on port 8080');
    
})