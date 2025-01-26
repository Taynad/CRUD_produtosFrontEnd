const btn_addproduct = document.getElementById('btn_addProduct');
const btn_cancel = document.getElementById('btn_cancel')
const popup_register = document.getElementById('popup_registerProduct');
const overlay = document.getElementById('overlay');

//função para abrir o popup
btn_addproduct.onclick = function(){
    popup_register.style.display = "block";
    overlay.style.display = "block";
}

btn_cancel.onclick = function(){
    popup_register.style.display = "none";
    overlay.style.display = "none";
}

