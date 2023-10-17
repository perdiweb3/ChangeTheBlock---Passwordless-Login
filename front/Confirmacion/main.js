window.onload = () => {
    const tokenInput = document.getElementById("tokenInput");
    const submitToken = document.getElementById("submitToken");

    const verifyToken = async () => {
        const url = "http://localhost:4000/verifyToken?token="+tokenInput.value;
        console.log(url);
        const message = await axios.get(url);
        console.log(message);
        if(message.status == 200){
            alert("Login Successfully");
        }
    }

    submitToken.addEventListener("click", verifyToken);
}
