import fs from 'fs';
// http  -> Lo tradicional que hemos estado utilizando muchos años.
// https -> ya tiene certificado SSL, el cual nos ayuda a que nuestros usuarios tengan encriptación punto punto
// http2 --> Es un nuevo protocolo más rápido, más eficiente. Soporta multiplex(Multiples solicitudes y respuestas a través de una única conexión TCP)
import http2 from 'http2';

/*
    Para generar el certificado SSL ejecutar en consola:
    openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt

    despues de rellenar los datos nos generará 2 archivos que son los que pasamos a key y cert
    después accedemos a: https://localhost:8080/
*/
const server = http2.createSecureServer({
    key: fs.readFileSync('./keys/server.key'),
    cert: fs.readFileSync('./keys/server.crt'),
}, (req, res) => {

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

    try {        
        const responseContent = fs.readFileSync(`./public${req.url}`, 'utf-8')
        res.end(responseContent);
    } catch (error) {
        res.writeHead(404, { 'Content-Type': 'text/html'});
        res.end()
    }


})

server.listen(8080, () => {
    console.log('Server is running on port 8080');
    
})