const api_url = " http://localhost:8080/produto";
document.addEventListener('DOMContentLoaded', () => {
    const btn_edit = document.getElementById('btn-edit');
    const popup = document.getElementById('popup_registerProduct');
    const overlay = document.getElementById('overlay');

    // Verificar se o botão existe antes de adicionar o evento
    if (btn_edit) {
        btn_edit.addEventListener('click', async (event) => {
            event.preventDefault();

            const novoProduto = {
                id: document.getElementById('input_id').value,
                nome: document.getElementById('input_name').value,
                descricao: document.getElementById('input_description').value,
                categoria: document.getElementById('input_category').value,
                quantidade: document.getElementById('input_amount').value,
            };

            try {
                const response = await fetch(api_url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(novoProduto),
                });

                if (!response.ok) {
                    throw new Error(`Erro: ${response.status}`);
                }

                const message = await response.json();
                console.log('Mensagem de resposta: ', message.sucess);
                showFeedbackMenssage(message.message, message.type);

                // Fechar o popup após sucesso
                document.getElementById('product-form').reset();
                popup.style.display = "none";
                overlay.style.display = "none";

                loadItems(); // Recarregar a lista de itens
            } catch (error) {
                console.error('Erro ao fazer a requisição: ', error.message);
            }
        });
    } else {
        console.error('Botão não encontrado');
    }
});
