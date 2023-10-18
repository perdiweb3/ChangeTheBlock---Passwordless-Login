//El codigo dentro de window.onload es ejecuta una vez que la pagina ha sido cargada completamente.
window.onload = () => {
    const email_address = document.getElementById("email_address");
    const submit_email = document.getElementById("submit_email");

    const handleAuth = async () =>{
        if(!verifyInput(email_address.value)){
            alert("Introduce una direccion de email valida.");
            email_address.innerHTML="";
        }else{
            try{
                await axios.post("http://localhost:4000/login",{
                    email: email_address.value
                });
                alert("Correo enviado correctamente.");
            }catch(e){
                alert("Error al enviar el correo. Vuelva a intentarlo es unos instantes.")
            }
        }
    }

    //Comprueba que la direccion introducida en la interfaz es valida.
    const emailRegex = /^\S+@\S+$/
    const verifyInput = (input) => {
        return (emailRegex.test(input));
    }

    submit_email.addEventListener("click", handleAuth);
};