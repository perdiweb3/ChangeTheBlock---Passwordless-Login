# ChangeTheBlock---Passwordless-Login

Instrucciones de uso.

Este proyecto consta de dos partes, el frontend y el backend. Para que el proyecto funcione tienen que estar funcionando las dos partes.

## Frontend

Consta de dos páginas: InicioSesion y Confirmacion. Cada página consta de un HTML y JS. Para desplegar el front he utilizado una extension de VSCode llamada Lite Server. Permite el despliegue en local de paginas HTML. Para utilizarlo basta con situarse en el fichero HTML a ser desplegado y pulsar en el boton de Lite Server que se encuentra en la parte inferior derecha de VSCode.

Para realizar las llamadas HTTP para la comunicación con el servidor he utilizado la librería **axios**.

## Backend

Consta de un fichero JS que realiza las funciones de servidor: escuchar peticiones, ejecutar la logica correspondiente y devolver la respuesta. Para desarrollar el backend se han utilizado las librerías:
1. **express** para montar el servidor.
2. **cors** para la política de cors.
3. **nodemailer** para automatizar el envío de correos electrónicos
4. **jwt** (JSONWebToken) para la creación y verificación del token.

Para desplegar el servidor basta con ejecutar el siguiente comando en la raíz del proyecto:
> node .\back\server.js

Si todo ha ido bien deberá aparecer en la consola el siguiente mensaje:
> Server runnign on port 4000

Por último, mencionar que el backend puede enviar correos electrónicos unicamente desde un cliente **Gmail**.

## .env

Fichero que contiene las variables de entorno necesarias para el correcto funcionamiento del proyecto. El proyecto consta de un fichero .env_template con las claves a las que hay que darle un valor. Estas son:

- **MAIL_USERNAME**: direccion de correo desde donde se van a enviar los emails.
- **MAIL_PASSWORD**: contraseña de la direccion anterior.
- **OAUTH_CLIENTID**: id del cliente oauth.
- **OAUTH_CLIENT_SECRET**: secreto del cliente oauth.
- **OAUTH_REFRESH_TOKEN**: token de recarga de oaut.

Para obtener los valores de las ultimas tres claves hay que seguir las instrucciones indicadas en este artículo: [Cómo usar Nodemailer para enviar correos electrónicos desde tu servidor Node.js](https://www.freecodecamp.org/espanol/news/como-usar-nodemailer-para-enviar-correos-electronicos-desde-tu-servidor-node-js/)

Una vez rellenados los valores basta con cambiar el nombre del fichero de *.env_template* a *.env*.

## Bibliografía

Aqui se indican las fuentes de información que he utilizado para desarrollar el proyecto:

1. [Implementing Passwordless Authentication in Node.JS](https://dev.to/flippedcoding/implementing-passwordless-authentication-in-node-js-43m0)

2. [How to send an email from JavaScript](https://stackoverflow.com/questions/7381150/how-to-send-an-email-from-javascript)

3. [Cómo usar Nodemailer para enviar correos electrónicos desde tu servidor Node.js](https://www.freecodecamp.org/espanol/news/como-usar-nodemailer-para-enviar-correos-electronicos-desde-tu-servidor-node-js/)