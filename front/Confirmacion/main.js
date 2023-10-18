window.onload = () => {
    const tokenInput = document.getElementById("tokenInput");
    const submitToken = document.getElementById("submitToken");

    const verifyToken = async () => {
        const url = "http://localhost:4000/verifyToken?token="+tokenInput.value;
        let message;
        
        try{
            message = await axios.get(url);
        }catch(e){
            alert(e.response.data);
        }

        if(message.status == 200){
            alert("Login Correcto.");
        }else{
            alert("Token no valido.")
        }
    }

    submitToken.addEventListener("click", verifyToken);
}
