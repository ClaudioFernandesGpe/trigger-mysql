document.getElementById('formInsert').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nomeInsert').value;
    const quantidade = document.getElementById('quantidadeInsert').value;
    const container = document.getElementById('logs');

    // montar o objeto
    const data = {
        nome: nome,
        quantidade: quantidade
    };

    console.log('Dados para inserção: ', data);

    await fetch('/produto', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    alert('Produto inserido!');

    e.target.reset();
    container.innerHTML = '';

});