// ============================================================
//  CHATBOT — Pão de Cada Dia
//  Arquivo: chatbot.js
//
//  Como usar nos HTMLs:
//  <link rel="stylesheet" href="chatbot.css">   ← no <head>
//  <script src="chatbot.js"></script>            ← antes do </body>
// ============================================================

let chatAberto  = false;
let menuVisivel = true;

// ──────────────────────────────────────────────
//  UTILITÁRIOS
// ──────────────────────────────────────────────
function calcularProximaFornada() {
  const agora    = new Date();
  const totalMin = agora.getHours() * 60 + agora.getMinutes();
  const inicio   = 6 * 60;
  const fim      = 20 * 60;

  if (totalMin < inicio) return "A primeira fornada sai às 6h da manhã! 🌅";
  if (totalMin >= fim)   return "As fornadas já encerraram por hoje. Amanhã a primeira sai às 6h! 😊";

  const minDesde6h     = totalMin - inicio;
  const proximosCiclos = Math.ceil((minDesde6h + 1) / 40) * 40;
  const proximaFornada = inicio + proximosCiclos;
  const h      = Math.floor(proximaFornada / 60).toString().padStart(2, "0");
  const m      = (proximaFornada % 60).toString().padStart(2, "0");
  const faltam = proximaFornada - totalMin;

  return `A próxima fornada sai às ${h}h${m === "00" ? "" : m}, em aproximadamente ${faltam} minuto${faltam !== 1 ? "s" : ""}. 🍞`;
}

function saudacaoHorario() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "Bom dia";
  if (h >= 12 && h < 18) return "Boa tarde";
  return "Boa noite";
}

function horaAtual() {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .trim();
}

// ──────────────────────────────────────────────
//  BASE DE RESPOSTAS
// ──────────────────────────────────────────────
const respostas = [
  {
    palavras: ["oi", "ola", "hey", "bom dia", "boa tarde", "boa noite", "boa", "tudo bem", "tudo bom", "salve", "eae", "e ai"],
    resposta: () => `${saudacaoHorario()}! Fico feliz em te receber aqui na Pão de Cada Dia. 🥐\n\nComo posso te ajudar hoje?`
  },
  {
    palavras: ["horario", "hora", "abre", "fecha", "funcionamento", "aberto", "funciona", "quando abre", "quando fecha", "domingo", "sabado", "semana"],
    resposta: () => `Nosso horário de funcionamento é:\n\n🕕 Segunda a sexta: 6h às 20h\n🕕 Sábado e domingo: 6h às 14h\n\nEstamos sempre prontos pra te receber com pão fresquinho! 😊`
  },
  {
    palavras: ["cardapio", "menu", "produtos", "itens", "o que tem", "o que voces tem", "o que vende", "tem o que", "catalogo"],
    resposta: () => `Nosso cardápio completo:\n\n🍞 Pães & Salgados\n• Pão Francês — R$ 0,80/un\n• Croissant — R$ 4,00/un\n• Brioche — R$ 3,50/un\n• Salgados variados — pergunte ao balcão\n\n🍰 Bolos & Doces\n• Bolo de Cenoura c/ chocolate — R$ 28,00\n• Bolo de Coco Cremoso — R$ 32,00\n• Brownie com sorvete — R$ 4,30\n\n🍹 Bebidas\n• Café artesanal — R$ 5,00\n• Suco natural — R$ 8,00\n• Achocolatado — R$ 6,00\n• Vinho, licor e cerveja artesanal — consulte disponibilidade`
  },
  {
    palavras: ["fornada", "pao quente", "pao fresco", "sai o pao", "pao saindo", "pao quentinho", "forno", "quando sai", "sai quando"],
    resposta: () => calcularProximaFornada()
  },
  {
    palavras: ["endereco", "onde fica", "localizacao", "onde e", "como chegar", "fica onde", "lugar", "rua", "bairro"],
    resposta: () => `Estamos aqui, te esperando! 📍\n\nRua dos Padeiros, 123\n📞 (11) 99999-9999\n📧 contato@paodecadadia.com\n\nVenha nos visitar, será um prazer te atender pessoalmente! 😄`
  },
  {
    palavras: ["telefone", "fone", "ligar", "numero", "contato", "whatsapp", "zap", "chamar"],
    resposta: () => `Pode nos chamar a qualquer momento! 📞\n\n(11) 99999-9999\n📧 contato@paodecadadia.com\n\nNossa equipe vai adorar te atender! 😊`
  },
  {
    palavras: ["pao frances", "franzinho", "frances", "pao fresquinho"],
    resposta: () => `O Pão Francês é o queridinho da casa! 🥖\n\nPreço: R$ 0,80/unidade\n\nFresquinho e crocante, saindo do forno a cada 40 minutos. Quer saber quando sai a próxima fornada?`
  },
  {
    palavras: ["croissant", "croassant", "cruasan", "folhado"],
    resposta: () => `Nosso Croissant é irresistível! 🥐\n\nPreço: R$ 4,00/unidade\n\nAmanteigado, folhado e feito com muito carinho pela equipe da Dona Lúcia.`
  },
  {
    palavras: ["brioche"],
    resposta: () => `O Brioche é uma delícia especial da casa! 🍞\n\nPreço: R$ 3,50/unidade\n\nMacio, levemente adocicado e perfeito para qualquer hora do dia.`
  },
  {
    palavras: ["bolo de cenoura", "cenoura", "bolo cenoura"],
    resposta: () => `O Bolo de Cenoura com cobertura de chocolate é um clássico aqui! 🍰\n\nPreço: R$ 28,00 (bolo inteiro)\n\nReceita da Dona Lúcia, impossível resistir!`
  },
  {
    palavras: ["bolo de coco", "coco cremoso", "bolo coco"],
    resposta: () => `O Bolo de Coco Cremoso é simplesmente sensacional! 🥥\n\nPreço: R$ 32,00 (bolo inteiro)\n\nSuper cremoso, com aquele gostinho caseiro que todo mundo ama.`
  },
  {
    palavras: ["brownie", "brownie com sorvete"],
    resposta: () => `Brownie com sorvete — a combinação perfeita! 🍫🍨\n\nPreço: R$ 4,30/unidade\n\nQuentinho por dentro, geladinho por fora. Uma experiência incrível!`
  },
  {
    palavras: ["cafe", "cafezinho", "espresso", "cappuccino", "cafeteria"],
    resposta: () => `Nosso Café Artesanal é preparado com todo cuidado! ☕\n\nPreço: R$ 5,00\n\nPerfeito para acompanhar qualquer item do nosso cardápio.`
  },
  {
    palavras: ["suco", "suco natural", "suquinho", "fruta"],
    resposta: () => `Nossos Sucos Naturais são fresquinhos e deliciosos! 🍊\n\nPreço: R$ 8,00\n\nPergunte ao balcão quais sabores temos disponíveis hoje!`
  },
  {
    palavras: ["achocolatado", "chocolate quente", "leite"],
    resposta: () => `Nosso Achocolatado é cremoso e muito gostoso! 🍫\n\nPreço: R$ 6,00\n\nÓtima pedida para os dias mais frios!`
  },
  {
    palavras: ["vinho", "cerveja", "licor", "bebida alcoolica", "drink", "alcool"],
    resposta: () => `Temos opções especiais de vinho, licor e cerveja artesanal! 🍷🍺\n\nA disponibilidade varia, então consulte nossa equipe no balcão ou ligue:\n📞 (11) 99999-9999`
  },
  {
    palavras: ["salgado", "salgados", "coxinha", "esfiha", "pastel", "kibe"],
    resposta: () => `Nossos salgados são feitos na hora, quentinhos e irresistíveis! 🥟\n\nOs sabores variam diariamente. Para saber o que temos hoje:\n📞 (11) 99999-9999`
  },
  {
    palavras: ["dona lucia", "fundadora", "historia", "sobre", "quem fundou", "como surgiu"],
    resposta: () => `A Pão de Cada Dia foi fundada em 2022 por Dona Lúcia, apaixonada por receitas de família. 👩‍🍳\n\nComeçamos com um pequeno forno e muita dedicação. Hoje conquistamos corações com pães artesanais, bolos caseiros e aquele café fresquinho que aquece o dia. ❤️`
  },
  {
    palavras: ["preco", "valor", "quanto custa", "quanto e", "custa", "precos", "tabela"],
    resposta: () => `Nossos preços:\n\n🍞 Pão Francês — R$ 0,80/un\n🥐 Croissant — R$ 4,00/un\n🍞 Brioche — R$ 3,50/un\n🍰 Bolo de Cenoura — R$ 28,00\n🥥 Bolo de Coco — R$ 32,00\n🍫 Brownie c/ sorvete — R$ 4,30\n☕ Café artesanal — R$ 5,00\n🍊 Suco natural — R$ 8,00\n🍫 Achocolatado — R$ 6,00`
  },
  {
    palavras: ["obrigado", "obrigada", "valeu", "agradeco", "thanks", "muito obrigado", "grato"],
    resposta: () => `Por nada! É sempre um prazer ajudar. 😊\n\nQualquer dúvida, é só chamar. Esperamos te ver em breve na Pão de Cada Dia! 🥐`
  },
  {
    palavras: ["tchau", "bye", "ate logo", "ate mais", "xau", "flw", "fui"],
    resposta: () => `Até logo! Foi um prazer te atender. 😊\n\nVenha nos visitar pessoalmente e prove nosso pão fresquinho! 🍞❤️`
  },
  {
    palavras: ["delivery", "entrega", "entregam", "motoboy", "pedir", "pedido", "ifood", "rappi"],
    resposta: () => `No momento não trabalhamos com delivery, mas você pode nos visitar! 🏠\n\n📍 Rua dos Padeiros, 123\n📞 (11) 99999-9999\n\nVenha sentir o cheirinho de pão fresquinho! 🍞`
  },
  {
    palavras: ["reserva", "encomenda", "encomendar", "encomendar bolo", "reservar", "encomendar pao"],
    resposta: () => `Aceitamos encomendas com prazer! 🎂\n\nEntre em contato para verificar disponibilidade e prazos:\n\n📞 (11) 99999-9999\n📧 contato@paodecadadia.com`
  },
  {
    palavras: ["pagamento", "pagar", "credito", "debito", "pix", "dinheiro", "cartao"],
    resposta: () => `Aceitamos diversas formas de pagamento! 💳\n\nPara confirmar quais estão disponíveis hoje, consulte nossa equipe:\n📞 (11) 99999-9999`
  },
  {
    palavras: ["gluten", "lactose", "vegano", "vegetariano", "dieta", "alergia", "alergia alimentar", "sem gluten"],
    resposta: () => `Entendemos a importância disso! 🌿\n\nPara informações sobre ingredientes e opções especiais, entre em contato com nossa equipe:\n📞 (11) 99999-9999\n📧 contato@paodecadadia.com`
  },
  {
    palavras: ["aniversario", "festa", "comemorar", "comemoracao", "evento"],
    resposta: () => `Que delícia comemorar com a gente! 🎉\n\nTemos bolos especiais e podemos conversar sobre encomendas para eventos. Fale com a nossa equipe:\n📞 (11) 99999-9999\n📧 contato@paodecadadia.com`
  },
  {
    palavras: ["wifi", "wi-fi", "internet", "senha"],
    resposta: () => `Para informações sobre Wi-Fi, consulte nossa equipe no balcão. 😊\n📞 (11) 99999-9999`
  },
  {
    palavras: ["estacionamento", "estacionar", "vaga", "parking", "carro"],
    resposta: () => `Para informações sobre estacionamento próximo, entre em contato:\n\n📞 (11) 99999-9999\n📍 Rua dos Padeiros, 123`
  }
];

// ──────────────────────────────────────────────
//  MOTOR DE RESPOSTAS
// ──────────────────────────────────────────────
function processarMensagem(texto) {
  const normalizado = normalizarTexto(texto);

  for (const item of respostas) {
    for (const palavra of item.palavras) {
      if (normalizado.includes(normalizarTexto(palavra))) {
        return item.resposta();
      }
    }
  }

  const padroes = [
    "Hmm, não tenho certeza se entendi! 😅 Use o menu abaixo ou pergunte sobre horários, cardápio, fornada ou contato.",
    "Essa eu não soube responder! 😊 Mas posso ajudar com horários, cardápio e endereço. Ou ligue: (11) 99999-9999.",
    "Não entendi direito, mas nossa equipe pode ajudar melhor! 📞 (11) 99999-9999 — ou use o menu abaixo. 😊"
  ];
  return padroes[Math.floor(Math.random() * padroes.length)];
}

// ──────────────────────────────────────────────
//  ESTRUTURA HTML (injetada no body)
// ──────────────────────────────────────────────
const widget = document.createElement("div");
widget.id = "chat-widget";
widget.innerHTML = `
  <button id="chat-fab" title="Falar com a Luísa">🍞</button>

  <div id="chat-janela" role="dialog" aria-label="Chat com a Luísa">

    <div id="chat-header">
      <div class="avatar">🥐</div>
      <div class="info">
        <div class="nome">Luísa — Pão de Cada Dia</div>
        <div class="status">Online agora</div>
      </div>
      <div id="chat-header-btns">
        <button id="chat-menu-btn" title="Abrir menu">☰</button>
        <button id="chat-fechar" aria-label="Fechar chat">✕</button>
      </div>
    </div>

    <div id="chat-msgs"></div>

    <div id="chat-menu">
      <button class="menu-item" data-msg="Qual o horário de funcionamento?"><span class="icone">🕐</span> Horário</button>
      <button class="menu-item" data-msg="Me mostra o cardápio completo"><span class="icone">🥖</span> Cardápio</button>
      <button class="menu-item" data-msg="Quando sai a próxima fornada?"><span class="icone">🍞</span> Próxima fornada</button>
      <button class="menu-item" data-msg="Qual o endereço e contato?"><span class="icone">📍</span> Endereço</button>
      <button class="menu-item" data-msg="Quais são os preços?"><span class="icone">💰</span> Preços</button>
      <button class="menu-item" data-msg="Vocês fazem encomendas?"><span class="icone">🎂</span> Encomendas</button>
      <button class="menu-item" data-msg="Vocês fazem delivery?"><span class="icone">🛵</span> Delivery</button>
      <button class="menu-item" data-msg="Me conta a história da padaria"><span class="icone">📖</span> Nossa história</button>
    </div>

    <div id="chat-footer">
      <button id="chat-voltar-menu">☰ Ver opções do menu</button>
      <div id="chat-input-area">
        <textarea id="chat-input" rows="1" placeholder="Digite sua mensagem..." aria-label="Mensagem"></textarea>
        <button id="chat-enviar" aria-label="Enviar">➤</button>
      </div>
    </div>

  </div>
`;
document.body.appendChild(widget);

// ──────────────────────────────────────────────
//  REFERÊNCIAS AOS ELEMENTOS
// ──────────────────────────────────────────────
const fab       = document.getElementById("chat-fab");
const janela    = document.getElementById("chat-janela");
const msgs      = document.getElementById("chat-msgs");
const input     = document.getElementById("chat-input");
const btnEnviar = document.getElementById("chat-enviar");
const menuEl    = document.getElementById("chat-menu");
const voltarBtn = document.getElementById("chat-voltar-menu");

// ──────────────────────────────────────────────
//  FUNÇÕES DE UI
// ──────────────────────────────────────────────
function adicionarBolha(texto, tipo) {
  const wrap = document.createElement("div");
  wrap.className = `bolha-wrap ${tipo}`;

  const avatarHtml = tipo === "bot" ? `<div class="mini-avatar">🥐</div>` : "";

  wrap.innerHTML = `
    <div class="bolha-inner">
      ${avatarHtml}
      <div class="bolha">${texto.replace(/\n/g, "<br>")}</div>
    </div>
    <span class="hora">${horaAtual()}</span>
  `;

  msgs.appendChild(wrap);
  msgs.scrollTop = msgs.scrollHeight;
}

function mostrarDigitando() {
  const wrap = document.createElement("div");
  wrap.className = "bolha-wrap bot";
  wrap.id = "digitando";
  wrap.innerHTML = `
    <div class="bolha-inner">
      <div class="mini-avatar">🥐</div>
      <div class="digitando"><span></span><span></span><span></span></div>
    </div>
  `;
  msgs.appendChild(wrap);
  msgs.scrollTop = msgs.scrollHeight;
}

function removerDigitando() {
  const el = document.getElementById("digitando");
  if (el) el.remove();
}

function mostrarMenu() {
  menuEl.classList.remove("escondido");
  voltarBtn.style.display = "none";
  menuVisivel = true;
}

function esconderMenu() {
  menuEl.classList.add("escondido");
  voltarBtn.style.display = "flex";
  menuVisivel = false;
}

function mensagemBoaVinda() {
  const sep = document.createElement("div");
  sep.className = "data-sep";
  sep.textContent = new Date().toLocaleDateString("pt-BR", {
    weekday: "long", day: "numeric", month: "long"
  });
  msgs.appendChild(sep);

  adicionarBolha(
    `${saudacaoHorario()}! 👋 Sou a Luísa, atendente virtual da Padaria Pão de Cada Dia. 🥐\n\nEscolha uma opção no menu abaixo ou digite sua pergunta!`,
    "bot"
  );
}

// ──────────────────────────────────────────────
//  ENVIO DE MENSAGEM
// ──────────────────────────────────────────────
function enviar(textoFixo) {
  const texto = textoFixo || input.value.trim();
  if (!texto) return;

  input.value = "";
  input.style.height = "auto";
  btnEnviar.disabled = true;

  esconderMenu();
  adicionarBolha(texto, "usuario");
  mostrarDigitando();

  const delay = 700 + Math.random() * 700;
  setTimeout(() => {
    const resposta = processarMensagem(texto);
    removerDigitando();
    adicionarBolha(resposta, "bot");
    btnEnviar.disabled = false;
    input.focus();
  }, delay);
}

// ──────────────────────────────────────────────
//  EVENTOS
// ──────────────────────────────────────────────
fab.addEventListener("click", () => {
  chatAberto = !chatAberto;
  janela.classList.toggle("aberto", chatAberto);
  fab.classList.toggle("aberto", chatAberto);

  if (chatAberto && msgs.children.length === 0) {
    mensagemBoaVinda();
    mostrarMenu();
  }
  if (chatAberto) input.focus();
});

document.getElementById("chat-fechar").addEventListener("click", () => {
  chatAberto = false;
  janela.classList.remove("aberto");
  fab.classList.remove("aberto");
});

document.getElementById("chat-menu-btn").addEventListener("click", () => {
  menuVisivel ? esconderMenu() : mostrarMenu();
});

voltarBtn.addEventListener("click", () => mostrarMenu());

btnEnviar.addEventListener("click", () => enviar());

input.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    enviar();
  }
});

input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = Math.min(input.scrollHeight, 100) + "px";
});

document.querySelectorAll(".menu-item").forEach(btn => {
  btn.addEventListener("click", () => enviar(btn.dataset.msg));
});
