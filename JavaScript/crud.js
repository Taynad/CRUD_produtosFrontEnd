// URL da API
const API_URL = "http://localhost:8080/produto";

// Elementos da tabela
const tableBody = document.getElementById("table_product");

// Elementos do formulário de adição
const productForm = document.getElementById("product-form");
const inputName = document.getElementById("input_name");
const inputDescription = document.getElementById("input_description");
const inputCategory = document.getElementById("input_category");
const inputAmount = document.getElementById("input_amount");

// Elementos do formulário de edição
const editForm = document.getElementById("form_edit");
const inputEditId = document.getElementById("input_id");
const inputEditName = document.getElementById("input_Editname");
const inputEditDescription = document.getElementById("input_Editdescription");
const inputEditCategory = document.getElementById("input_Editcategory");
const inputEditAmount = document.getElementById("input_Editamount");

function showFeedbackMessage(message, type = 'success'){
    //obtendo o elemento do html
    const feedbackElement = document.getElementById('feedback-message');
    //define o texto da mensagem a ser exibida
    feedbackElement.textContent = message;
    //modifica a classe para incluir o tipo de classe do css se é error ou sucess
    feedbackElement.className = `feedback-message ${type}`;
    //exibe o elemento com o block
    feedbackElement.style.display = 'flex';
    //função para criar um temporizador que vai executar a função, altera para none tornando invisivel
    //isso cria o efeito da mensagem desaparecer depois de 5 segundos
    setTimeout(() =>{
        feedbackElement.style.display = 'none';
    }, 10000);
}

// Função para carregar os produtos na tabela
async function loadProducts() {
    try {
        const response = await fetch(API_URL);
        const products = await response.json();
        tableBody.innerHTML = ""; // Limpa a tabela antes de carregar os dados

        products.forEach((product) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.nome}</td>
                <td>${product.descricao}</td>
                <td>${product.categoria}</td>
                <td>${product.quantidade}</td>
                <td>
                    <button class="btn-edit" data-id="${product.id}" data-nome="${product.nome}" 
                    data-descricao="${product.descricao}" data-categoria="${product.categoria}" data-quantidade="${product.quantidade}">
                        <svg width="35" height="35" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04ZM3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25Z"/>
                        </svg>
                    </button>
                </td>
                <td>
                    <button class="btn-delete" data-id="${product.id}">
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z"/>
                        </svg>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        document.querySelectorAll(".btn-edit").forEach(button => {
            button.addEventListener("click", () => {
                const product = {
                    id: button.getAttribute("data-id"),
                    nome: button.getAttribute("data-nome"),
                    descricao: button.getAttribute("data-descricao"),
                    categoria: button.getAttribute("data-categoria"),
                    quantidade: button.getAttribute("data-quantidade"),
                };
                openEditPopup(product);
            });
        }); 

        document.querySelectorAll(".btn-delete").forEach(button => {
            button.addEventListener("click", () => deleteProduct(button.dataset.id));
        });
}catch(error){
    console.log(error)
    showFeedbackMessage("Erro ao carregar produtos.", "error");

}
}

// Função para abrir o popup de edição
function openEditPopup(product) {

    console.log("Produto no openEditPopup:", product);
    console.log("Id do produto:", product.id);
    console.log("Nome do produto:", product.nome);
    console.log("Descrição do produto:", product.descricao);
    console.log("Categoria do produto:", product.categoria);
    console.log("Quantidade do produto:", product.quantidade);
    // Preenche os campos do formulário com os dados do produto
    inputEditId.value = product.id;
    inputEditName.value = product.nome;
    inputEditDescription.value = product.descricao;
    inputEditCategory.value = product.categoria;
    inputEditAmount.value = product.quantidade;
    
    // Exibe o popup e o overlay
    document.getElementById("popup_edit").style.display = "block";
    document.getElementById("overlayEdit").style.display = "block";
    
}

// Função para adicionar um produto
async function addProduct(event) {
    event.preventDefault();

    const product = {
        nome: inputName.value,
        descricao: inputDescription.value,
        categoria: inputCategory.value,
        quantidade: inputAmount.value,
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
        });

        const data = await response.json();
        console.log("Resposta do servidor:", data);

        if (response.ok) {
            showFeedbackMessage(data.message, data.type);
        } else {
            showFeedbackMessage("Erro ao adicionar produto.", "error");
        }

        setTimeout(() => {
            // Carregar produtos e resetar o formulário
            loadProducts();
            productForm.reset();
    
            // Fechar o popup
            document.getElementById("popup_registerProduct").style.display = "none";
            document.getElementById("overlay").style.display = "none";
        }, 3000);

    } catch (error) {
        showFeedbackMessage("Erro ao adicionar produto.", "error");
        console.error(error);
    }
}

// Função para atualizar um produto
async function updateProduct(event) {
    event.preventDefault();

    if (!inputEditId.value) {
        showFeedbackMessage("ID do produto não encontrado.", "error");
        return;
    }

    const product = {
        id: inputEditId.value,
        nome: inputEditName.value,
        descricao: inputEditDescription.value,
        categoria: inputEditCategory.value,
        quantidade: inputEditAmount.value,
    };

    console.log("Produto a ser atualizado:", product);
    console.log("URL da requisição:", `${API_URL}/${product.id}`);

    try {
        const response = await fetch(`${API_URL}/${product.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
        });

        const data = await response.json();
        console.log("Resposta da API:", data);

        if (response.ok) {
            showFeedbackMessage(data.message, data.type);
            loadProducts();
            document.getElementById("popup_edit").style.display = "none";
            document.getElementById("overlayEdit").style.display = "none";
        } else {
            showFeedbackMessage("Erro ao atualizar produto.", "error");
        }
    } catch (error) {
        showFeedbackMessage("Erro ao atualizar produto.", "error");
        console.error(error);
    }
}
document.getElementById("btn_EditformProduct").addEventListener("click", updateProduct);

document.getElementById("form_edit").addEventListener("click", (event) => {
    event.preventDefault(); // Impede o comportamento padrão do formulário
});

// Adiciona o evento de clique ao botão de cancelar
document.getElementById("btn_Editcancel").addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("popup_edit").style.display = "none";
    document.getElementById("overlayEdit").style.display = "none";
});

// Adiciona o evento de clique ao overlay para fechar o popup
document.getElementById("overlayEdit").addEventListener("click", () => {
    document.getElementById("popup_edit").style.display = "none";
    document.getElementById("overlayEdit").style.display = "none";
});

// Função para excluir um produto
async function deleteProduct(productId) {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
        try {
            const response = await fetch(`${API_URL}/${productId}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (response.ok) {
                showFeedbackMessage(data.message, data.type);
                loadProducts();
            } else {
                showFeedbackMessage("Erro ao excluir produto.", "error");
            }
        } catch (error) {
            showFeedbackMessage("Erro ao excluir produto.", "error");
            console.error(error);
        }
    }
}

// Eventos
document.addEventListener("DOMContentLoaded", loadProducts);
productForm.addEventListener("submit", addProduct);
editForm.addEventListener("submit", updateProduct);
document.getElementById("btn_Editcancel").addEventListener("click", () => {
    document.getElementById("popup_edit").style.display = "none";
    document.getElementById("overlayEdit").style.display = "none";
});


