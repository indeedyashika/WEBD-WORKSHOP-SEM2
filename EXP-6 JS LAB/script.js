let fontSize = 16;
function changeHeading(){
    let text = document.getElementById("headingInput").value;
    if(text !== ""){
        document.getElementById("heading").innerText = text;
    }
}
function changeBackground(){
    document.body.style.background ="#" + Math.floor(Math.random()*16777215).toString(16);
}
function increaseFont(){
    fontSize += 2;
    document.getElementById("paragraph").style.fontSize = fontSize + "px";
}
function decreaseFont(){
    fontSize -= 2;
    document.getElementById("paragraph").style.fontSize = fontSize + "px";
}
function changeFontColor(){
    document.getElementById("paragraph").style.color = "#" + Math.floor(Math.random()*16777215).toString(16);
}
function toggleParagraph(){
    let p = document.getElementById("paragraph");
    if(p.style.display === "none"){
        p.style.display = "block";
    }
    else{
        p.style.display = "none";
    }
}
function resetPage(){
    document.getElementById("heading").innerText = "Welcome to JavaScript Lab";
    document.body.style.background = "#f5f6fa";
    document.getElementById("paragraph").style.fontSize = "16px";
    document.getElementById("paragraph").style.display = "block";
    document.getElementById("headingInput").value = "";

}