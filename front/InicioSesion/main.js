//El codigo dentro de window.onload es ejecuta una vez que la pagina ha sido cargada completamente.
window.onload = () => {
    const email_address = document.getElementById("email_address");
    const submit_email = document.getElementById("submit_email");

    const handleAuth = async () =>{
        const message = await axios.post("http://localhost:4000/login",{
            email: email_address.value
        });
        return message;
    }

    submit_email.addEventListener("click", handleAuth);
};