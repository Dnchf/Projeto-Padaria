document.addEventListener("DOMContentLoaded", () => {
  const carrinhoContainer = document.getElementById("itens-carrinho");
  const totalSpan = document.getElementById("total");
  const btnFinalizar = document.querySelector(".btn-finalizar");

  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  function atualizarCarrinho() {
    carrinhoContainer.innerHTML = "";
    let total = 0;

    if (carrinho.length === 0) {
      carrinhoContainer.innerHTML = "<p>O carrinho está vazio 🛒</p>";
    }

    carrinho.forEach((item, index) => {
      const itemEl = document.createElement("div");
      itemEl.className = "item";

      itemEl.innerHTML = `
        <span class="item-nome">${item.nome}</span>
        <span>R$ ${item.preco.toFixed(2)}</span>
        <button onclick="removerItem(${index})">🗑</button>
      `;

      carrinhoContainer.appendChild(itemEl);
      total += item.preco;
    });

    totalSpan.textContent = `R$ ${total.toFixed(2)}`;
  }

  window.removerItem = function (index) {
    carrinho.splice(index, 1);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    atualizarCarrinho();
  };

  btnFinalizar.addEventListener("click", () => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

   
    if (!usuarioLogado) {
      Swal.fire({
        icon: "warning",
        title: "Acesso negado!",
        text: "Você precisa estar logado para finalizar a compra.",
        confirmButtonText: "Fazer login",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "Login.html";
        }
      });
      return;
    }

    // 🚫 Carrinho vazio
    if (carrinho.length === 0) {
      Swal.fire({
        icon: "info",
        title: "Carrinho vazio!",
        text: "Adicione algum produto antes de finalizar a compra.",
        confirmButtonColor: "#a0522d",
        background: "#fff7f0",
        color: "#8b4513",
      });
      return;
    }

    // ✅ Compra finalizada
    Swal.fire({
      icon: "success",
      title: "Compra finalizada com sucesso! 🎉",
      text: "Obrigado por comprar conosco! 😊",
      confirmButtonText: "OK",
      confirmButtonColor: "#a0522d",
      background: "#fff7f0",
      color: "#8b4513",
    }).then(() => {
      localStorage.removeItem("carrinho");
      location.reload();
    });
  });

  atualizarCarrinho();
});
