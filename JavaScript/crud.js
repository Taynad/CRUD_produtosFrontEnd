const urlApi = "http://localhost:8080/produto";

function openEditPopup(product){
    const popupEdit = document.getElementById('popup_edit');
    const overlayEdit = document.getElementById('overlayEdit');

    //preenchendo o form com as informações do produto
    document.getElementById('input_id').value= product.id;
    document.getElementById('input_Editname').value = product.nome;
    document.getElementById('input_Editdescription').value = product.descricao;
    document.getElementById('input_Editcategory').value = product.categoria;
    document.getElementById('input_Editamount').value = product.quantidade;

    popupEdit.style.display = "block";
    overlayEdit.style.display = "block";

    //fechar popup
    const cancelButton = document.getElementById('btn_Editcancel');
    cancelButton.addEventListener('click', (event)=>{
        popupEdit.style.display = 'none';
        overlayEdit.style.display = 'none';
    });
}

const editForm = document.getElementById('form_edit');

editForm.addEventListener('submit', async (event)=> {
    event.preventDefault();
    const id = document.getElementById('input_id').value;
    const nome = document.getElementById('input_Editname').value;
    const descricao = document.getElementById('input_Editdescription').value;
    const categoria = document.getElementById('input_category').value;
    const quantidade = document.getElementById('input_Editamount').value;

    //cria o corpo da requisição
    const updateProduct={
        nome,
        descricao,
        categoria,
        quantidade,
    };

    try{
        //fazendo a requisição
        const response = await fetch(`http://localhost:8080/produto/${id}`,{
            method: 'PUT',
            headers: {'Content-type' : 'application/json'},
            body: JSON.stringify(updateProduct),
        });

        if(response.ok){
            showFeedbackMenssage(response.message, response.type)
            document.getElementById('popup_edit').style.display = 'none';
            document.getElementById('overlayEdit').style.display = 'none';

            // Atualiza a tabela para refletir as mudanças
            const updatedProductData = await response.json();
            console.log('Produto atualizado com sucesso:', updatedProductData);
            listProduct();
        }else{
            const error = await response.json();
            console.error = ('Erro ao atualizar produto', error)
            showFeedbackMenssage(response.message, response.type)
        }
    }catch(error){
        console.error('Erro na requisição', error);
        showFeedbackMenssage(error, error);

    }
})


async function listProduct(){
    try{
        //requisição get
        const response = await fetch(urlApi);
        if(!response.ok){
            throw new console.error("Erro ao buscar os produtos");
        }
        
        const products = await response.json();

        //preenchendo a tabela
        
            const tableProduct = document.getElementById("table_product");
            tableProduct.innerHTML = '';

            products.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML= `
                    <td>${product.id}</td>
                    <td>${product.nome}</td>
                    <td>${product.descricao}</td>
                    <td>${product.categoria}</td>
                    <td>${product.quantidade}</td>
                    <td>  <button class="edit-btn" data-id="${product.id}" id="btn-edit">
                    <svg width="35" height="35" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04ZM3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25Z"/>
                    </svg>
                    </button></td>

                    <button class="delete-btn" data-id="${product.id}" >
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z"/>
                    </svg>
                    </button></td>
                `;

                tableProduct.appendChild(row);
                const editButton = row.querySelector('.edit-btn');
                editButton.addEventListener('click', () => {
                    openEditPopup(product);
            });
        });
    
    }catch(error){
        console.error("Error", error);
        alert("Erro ao carregar produtos " + error.message);
    }
}

window.onload = listProduct;

async function saveProduct(event){
    event.preventDefault();

    const nome = document.getElementById('input_name').value;
    const descricao = document.getElementById('input_description').value;
    const categoria = document.getElementById('input_category').value;
    const quantidade = document.getElementById('input_amount').value;

    if(!nome || !descricao || !categoria || !quantidade){
        showFeedbackMenssage('Preencha todos os campos', "error")
        return;
    }

    try{
        const response = await fetch(urlApi,{
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({nome, descricao, categoria, quantidade})
        });

        if(!response.ok){
            const result = await response.json();
            throw new Error(result.message || "Erro desconhecido");
        }

        const result = await response.json();
        console.log("Resposta da API:", JSON.stringify(result, null, 2));
        showFeedbackMenssage(result.message, result.type);
    }catch(error){
        console.error("Erro ao conectar a API", error)
        showFeedbackMenssage(error.message, "error")
    }

}

// Função para cancelar
function cancelForm(event) {
    event.preventDefault();
    document.getElementById('product-form').reset(); // Limpa o formulário
    showFeedbackMessage("Operação cancelada", "success");
}

// Adiciona o evento de submit ao formulário
document.getElementById('product-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Previne o comportamento padrão do formulário

    // Verifica qual botão foi clicado
    const clickedButton = event.submitter;

    if (clickedButton.id === 'btn_formProduct') {
        saveProduct(event); // Executa a função de salvar o produto
    } else if (clickedButton.id === 'btn_cancel') {
        cancelForm(event); // Executa a função de cancelar
    }
});




function showFeedbackMenssage(message, type = 'success'){
    //obtendo o elemento do html
    const feedbackElement = document.getElementById('feedback-message');
    //define o texto da mensagem a ser exibida
    feedbackElement.textContent = message;
    //modifica a classe para incluir o tipo de classe do css se é error ou sucess
    feedbackElement.className = `feedback-message ${type}`;
    //exibe o elemento com o block
    feedbackElement.style.display = 'block';
    //função para criar um temporizador que vai executar a função, altera para none tornando invisivel
    //isso cria o efeito da mensagem desaparecer depois de 5 segundos
    setTimeout(() =>{
        feedbackElement.style.display = 'none';
    }, 5000);

}


