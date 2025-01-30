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

// Função para exibir mensagens de feedback
function showFeedbackMessage(message, type = "success") {
    const feedbackElement = document.getElementById("feedback-message");
    feedbackElement.textContent = message;
    feedbackElement.className = `feedback-message ${type}`;
    feedbackElement.style.display = "block";
    setTimeout(() => {
        feedbackElement.style.display = "none";
    }, 5000);
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
                    <button class="btn-edit" data-id="${product.id}">
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

        // Adiciona eventos aos botões de editar e excluir
        document.querySelectorAll(".btn-edit").forEach((button) => {
            button.addEventListener("click", () => openEditPopup(button.dataset.id));
        });

        document.querySelectorAll(".btn-delete").forEach((button) => {
            button.addEventListener("click", () => deleteProduct(button.dataset.id));
        });
    } catch (error) {
        showFeedbackMessage("Erro ao carregar produtos.", "error");
        console.error(error);
    }
}

// Função para abrir o popup de edição
async function openEditPopup(productId) {
    
    // Exibe o popup de edição
    document.getElementById("popup_edit").style.display = "block";
    document.getElementById("overlayEdit").style.display = "block";

    try {
        const response = await fetch(`${API_URL}/${productId}`);
        const product = await response.json();

        console.log("Dados do produto:", product);

        // Preenche o formulário de edição com os dados do produto
        inputEditId.value = product.id;
        inputEditName.value = product.nome;
        inputEditDescription.value = product.descricao;
        inputEditCategory.value = product.categoria;
        inputEditAmount.value = product.quantidade;

    } catch (error) {
        showFeedbackMessage("Erro ao carregar produto para edição.", "error");
        console.error(error);
    }
}

// Adiciona eventos aos botões de edição
document.addEventListener("DOMContentLoaded", () => {
    const editButtons = document.querySelectorAll(".btn-edit");
    editButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const productId = button.getAttribute("data-id"); // Obtém o ID do produto
            openEditPopup(productId); // Abre o popup de edição
        });
    });
});

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

        if (response.ok) {
            showFeedbackMessage("Produto adicionado com sucesso!", "success");
            loadProducts();
            productForm.reset();
            document.getElementById("popup_registerProduct").style.display = "none";
            document.getElementById("overlay").style.display = "none";
        } else {
            showFeedbackMessage("Erro ao adicionar produto.", "error");
        }
    } catch (error) {
        showFeedbackMessage("Erro ao adicionar produto.", "error");
        console.error(error);
    }
}

// Função para atualizar um produto
async function updateProduct(event) {
    event.preventDefault();

    const product = {
        id: inputEditId.value,
        nome: inputEditName.value,
        descricao: inputEditDescription.value,
        categoria: inputEditCategory.value,
        quantidade: inputEditAmount.value,
    };

    try {
        const response = await fetch(`${API_URL}/${product.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
        });

        if (response.ok) {
            showFeedbackMessage("Produto atualizado", "success");
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

// Função para excluir um produto
async function deleteProduct(productId) {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
        try {
            const response = await fetch(`${API_URL}/${productId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                showFeedbackMessage("Produto excluído com sucesso!");
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


