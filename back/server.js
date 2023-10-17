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

//2- Crea un objeto MailOptions
//3- Usa el metodo Transporter.sendMail

//Configuracion del servidor
const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Endpoint
app.get("/hello", (req, res) => {
    res.status(200);
    res.send(`Hello World`);
});

app.post("/login", (req,res) => {
    const email = req.body.email;

    if(!email){
        res.statusCode(403);
        res.send({
            message: "Problem with email."
        });
    }

    const token = makeToken(email);

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

    return transport.sendMail(mailOptions, (error) => {
        if(error){
            console.log("err");
            res.status(404);
            res.send("Can't send email.");
        }else{
            console.log("ok");
            res.status(200);
            res.send(`Magic link sent. : http://localhost:5500/account?token=${token}`);
        }
    });
});

app.get("/verifyToken", (req, res) => {
    isAuthenticated(req,res);
});

const isAuthenticated = (req, res) => {
    const {token} = req.query;
    console.log(token);
    if (!token) {
        res.status(403)
        res.send("Can't verify user.")
        return
    }

    let decoded;
    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    }catch{
        res.status(403)
        res.send("Invalid auth credentials.")
        return
    }

    if(!decoded.hasOwnProperty("email") || !decoded.hasOwnProperty("expirationDate")){
        console.log("Invalid auth credentials.")
        res.status(403)
        res.send("Invalid auth credentials.")
        return
    }

    const {expirationDate} = decoded;
    if(expirationDate < new Date()){
        console.log("Token has expired.");
        res.status(403)
        res.send("Token has expired.")
        return
    }

    console.log("User has been validated.")
    res.status(200)
    res.send("User has been validated.")
}

//Start the server
app.listen(PORT, () => {
    console.info("Server runnign on port " + PORT);
});


{/* <p>Here's the login link you just requested:</p> */}
const emailTemplate = ({username,link,token}) => `
    <h2>Hola ${username}</h2>
    <p>Introduce el token en el siguiente enlace</p>
    <p>${link}</p>
    <p>Token: ${token}</p>
`;

const makeToken = (email) => {
    const expirationDate = new Date();
    expirationDate.setHours(new Date().getHours() + 1);
    return jwt.sign({email,expirationDate}, process.env.JWT_SECRET_KEY);
}

// export default server;