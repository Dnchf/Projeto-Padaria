document.addEventListener("DOMContentLoaded", () => {
    const carrinhoContainer = document.getElementById("itens-carrinho");
    const totalSpan = document.getElementById("total");
  
  
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
  
    window.removerItem = function(index) {
      carrinho.splice(index, 1);
      localStorage.setItem("carrinho", JSON.stringify(carrinho));
      atualizarCarrinho();
    }
  
    const btnFinalizar = document.querySelector(".btn-finalizar");
    btnFinalizar.addEventListener("click", () => {
      if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
      } else {
        alert("Compra finalizada com sucesso! Obrigado 😊");
        localStorage.removeItem("carrinho");
        location.reload();
      }
    });
  
    atualizarCarrinho();
  });
  