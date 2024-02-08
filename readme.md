# Nombre del Proyecto

API para un ecommerce de libros

## Objetivo de esta preentrega

- Modificar rutas y schema de usuario para permitir la carga de documentos. Agregar propiedad last_connection

## Iniciar el Proyecto

Para iniciar el proyecto, sigue los siguientes pasos:

1. Instala las dependencias:

npm install

"@faker-js/faker": "^8.3.1",
"bcrypt": "^5.1.1",
"commander": "^11.1.0",
"connect-mongo": "^5.1.0",
"cookie-parser": "^1.4.6",
"dotenv": "^16.3.1",
"express": "^4.18.2",
"express-handlebars": "^7.1.2",
"express-session": "^1.17.3",
"jsonwebtoken": "^9.0.2",
"method-override": "^3.0.0",
"mongodb-connection-string-url": "^3.0.0",
"mongoose": "^6.10.0",
"mongoose-paginate-v2": "^1.7.4",
"multer": "^1.4.5-lts.1",
"nodemailer": "^6.9.7",
"package-name": "^0.1.0",
"passport": "^0.6.0",
"passport-github2": "^0.1.12",
"passport-local": "^1.0.0",
"session-file-store": "^1.5.0",
"socket.io": "^4.7.2",
"swagger-jsdoc": "^6.2.8",
"swagger-ui-express": "^5.0.0",
"twilio": "^4.20.0",
"uuid": "^9.0.1",
"winston": "^3.11.0"
"devDependencies": {
"chai": "^4.4.0",
"mocha": "^10.2.0",
"nodemon": "^3.0.1",
"supertest": "^6.3.3"
}

2. Inicia el servidor

npm start

## Aplicaciones agregadas

# Modificaciones de Schema

Se agrego propiedad last_connection la cual se modifica al hacer login y logout
Se agrego propiedad documents que es un array de documentos

# Carga de documentos

Se utilizó multer para permitir la carga de documentos, se habilito una nueva vista para que el usuario cargue los documentos requeridos

http://localhost:8080/:uid/documents

Se creo archivo multer que contiene la configuracion de multer, los archivos se guardan por separado segun documentacion o imagenes

# Autenticacion de usuarios

Se modifico la ruta http://localhost:8080/api/users/premium/:uid para que unicamente permita que el usuario pase a premium si previamente realizo la carga de documentacion.

## Rutas para interactuar con postman

# Agregar Producto

Ruta POST
http://localhost:8080/api/products

Cuerpo de la solicitud

{
"name": "nombre del producto",
"description": "descripcion del producto",
"price": 2000,
"stock": 20,
"category": "categoria",
"thumbnail": "url de la imagen en png"
}

# Agregar Carrito

Ruta POST
http://localhost:8080/api/carts

Cuerpo de la solicitud

{
"name": "nombre carrito",
"description": "descripcion carrito",
"products": []
}

# Agregar Producto a un Carrito

Ruta POST
http://localhost:8080/api/carts/<cid>/products/<pid>

Cuerpo de la solicitud
{
"id": "<pid>",
"cantidad": 1
}

# Ruta para Agregar Ticket

POST
http://localhost:8080/api/carts/<cid>/purchase

## Usuarios de Prueba

Usuario Admin
Email: uadmin@gmail.com
Contraseña: 1

Usuario Basico
Email: ubasico@gmail.com
Contraseña: 1

Usuario Premium
Email: upremium@gmail.com
Contraseña: 1

## Carritos de Prueba

Para productos con stock
ID: 65804fabfa5eb4929dd1ecea

Para productos sin stock
ID: 65805c4dbc17875eca98d93d

Productos de Prueba con stock
ID: 65804717fa5eb4929dd1ec8e
ID: 6580439568ab20da69fad8bb

Producto de Prueba sin Stock
ID: 65805c4dbc17875eca98d93d
