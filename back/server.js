//Importacion de dependencias
const cors = require("cors");
const express = require("express");
const nodeMailer = require("nodemailer");
const jwt = require('jsonwebtoken');
require("dotenv").config();

//Nodemailer
//1- Crea un objeto transporter
const transport = nodeMailer.createTransport({
    service: 'gmail',
    auth:{
        type: 'OAuth2',
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
});

//Configuracion del servidor
const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Endpoints

//HelloWorld
//Utilizado para comprobar que el servidor esta funcionando correctamente.
app.get("/hello", (req, res) => {
    res.status(200);
    res.send(`Hello World`);
});

//Login
//Recibe una direccion de email, genera un token JWT, genera un correo electronico con el token de inicio de sesion
//y envía el correo a la direccion recibida.
app.post("/login", (req,res) => {
    const email = req.body.email;

    if(!email){
        res.statusCode(403);
        res.send({
            message: "Problem with email."
        });
    }

    const token = makeToken(email);

    //Nodemailer
    //2- Crea un objeto MailOptions
    const mailOptions = {
        from: "Admin",
        html: emailTemplate({
            email,
            link: `http://localhost:5500/front/Confirmacion/index.html`,
            token: token,
        }),
        subject: "Session Login",
        to: email,
    };

    //Nodemailer
    //3- Usa el metodo Transporter.sendMail
    return transport.sendMail(mailOptions, (error) => {
        if(error){
            
            res.status(404);
            res.send("Can't send email.");
        }else{
            
            res.status(200);
            res.send(`Magic link sent. : http://localhost:5500/account?token=${token}`);
        }
    });
});

//Verificacion
app.get("/verifyToken", (req, res) => {
    isAuthenticated(req,res);
});

//Recibe el token a traves de la URL
//ejemplo: http://localhost:4000/verifyToken?token="+token
//Comprueba si ha recibido el token a traves de la URL, comprueba que el token es valido
//y si es asi devuelve una respuesta validad => res.status(200)
const isAuthenticated = (req, res) => {
    //Obtiene el token
    const {token} = req.query;
    //Comprueba que el token se ha obtenido correctamente
    if (!token) {
        res.status(403)
        res.send("Can't verify user.")
        return
    }

    //Comprueba que el token ha sido emitido por el servidor
    let decoded;
    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    }catch{
        res.status(403)
        res.send("Invalid auth credentials.")
        return
    }

    //Comprueba que el token tiene los campos que el servidor utilizo en la creacion
    //para asegurar que el token fue emitido por el servidor.
    if(!decoded.hasOwnProperty("email") || !decoded.hasOwnProperty("expirationDate")){
        res.status(403)
        res.send("Invalid auth credentials.")
        return
    }

    //Comprueba que el token sigue vigente, que el token no ha caducado
    const {expirationDate} = decoded;
    if(expirationDate < new Date()){
        res.status(403)
        res.send("Token has expired.")
        return
    }

    //Devuelve una respuesta satisfactoria.
    res.status(200)
    res.send("User has been validated.")
}

//Start the server
app.listen(PORT, () => {
    console.info("Server runnign on port " + PORT);
});

//Crea una plantilla en HTML con el contenido del email que se va a enviar.
//Recibe por parametros los campos que varian en la plantilla.
const emailTemplate = ({username,link,token}) => `
    <h2>Hola ${username}</h2>
    <p>Introduce el token en el siguiente enlace</p>
    <p>${link}</p>
    <p>Token: ${token}</p>
`;

//Crea un token introduciendo el email del solicitante y con un tiempo de validez de 1 hora.
const makeToken = (email) => {
    const expirationDate = new Date();
    expirationDate.setHours(new Date().getHours() + 1);
    return jwt.sign({email,expirationDate}, process.env.JWT_SECRET_KEY);
}