 function adicionarAoCarrinho(nome, preco) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinho.push({ nome, preco });
    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    // Pop-up moderno usando SweetAlert2
    Swal.fire({
      icon: 'success',
      title: 'Produto adicionado!',
      text: `${nome} adicionado ao carrinho!`,
      confirmButtonText: 'OK'
          });
  }