"use strict";

// ══════════════════════════════════════════════════════════════════════════════
const CONFIG = {

  GEMINI_MODEL: "gemini-3-flash-preview",   

  MAX_HISTORICO: 5,                   
};

// ══════════════════════════════════════════════════════════════════════════════
//  🏪  DADOS DA PADARIA
// ══════════════════════════════════════════════════════════════════════════════
const PADARIA = {
  nome:      "Pão de Cada Dia",
  fundacao:  "2022",
  fundadora: "Dona Lúcia",
  endereco:  "Rua dos Padeiros, 123 — São Paulo/SP",
  telefone:  "(11) 99999-9999",
  email:     "contato@paodecadadia.com",

  horario: {
    semana:    "Segunda a sexta: 6h às 20h",
    fds:       "Sábados e domingos: 6h às 14h",
    inicioDia: 6 * 60,
    fimSemana: 20 * 60,
    fimFds:    14 * 60,
  },

  cardapio: {
    paes: [
      { nome: "Pão Francês",       preco: "R$ 0,80/un",       info: "Crocante por fora, macio por dentro. Sem lactose.",                         tags: ["sem lactose"] },
      { nome: "Croissant",         preco: "R$ 4,00/un",       info: "Massa folhada amanteigada. Contém glúten e laticínios.",                    tags: ["contém glúten", "contém laticínios"] },
      { nome: "Brioche",           preco: "R$ 3,50/un",       info: "Levemente adocicado e macio. Contém ovos, glúten e laticínios.",            tags: ["contém glúten", "contém ovos", "contém laticínios"] },
      { nome: "Pão de Queijo",     preco: "R$ 3,00/un",       info: "Feito com polvilho. Sem glúten. Contém laticínios.",                        tags: ["sem glúten", "contém laticínios"] },
      { nome: "Pão Integral",      preco: "R$ 1,20/un",       info: "Feito com farinha integral. Contém glúten.",                                tags: ["contém glúten"] },
      { nome: "Salgados variados", preco: "Consultar balcão", info: "Coxinha, esfiha, pastel, kibe — sabores conforme disponibilidade do dia.",   tags: [] },
    ],
    doces: [
      { nome: "Bolo de Cenoura c/ chocolate", preco: "R$ 28,00 (inteiro) / R$ 7,00 (fatia)",  info: "Receita da Dona Lúcia. Vegano!",                                  tags: ["vegano"] },
      { nome: "Bolo de Coco Cremoso",         preco: "R$ 32,00 (inteiro) / R$ 8,00 (fatia)",  info: "Cremoso, com coco ralado. Contém laticínios.",                    tags: ["contém laticínios"] },
      { nome: "Brownie c/ sorvete",           preco: "R$ 4,30/un",                            info: "Quente com sorvete de creme. Contém glúten, ovos e laticínios.",  tags: ["contém glúten", "contém ovos", "contém laticínios"] },
      { nome: "Torta de Limão",               preco: "R$ 9,00 (fatia)",                       info: "Disponível às sextas e sábados. Contém ovos e laticínios.",       tags: ["contém ovos", "contém laticínios"] },
      { nome: "Cookie de Chocolate",          preco: "R$ 5,00/un",                            info: "Crocante por fora, macio por dentro. Contém glúten e ovos.",      tags: ["contém glúten", "contém ovos"] },
    ],
    bebidas: [
      { nome: "Café artesanal (espresso)", preco: "R$ 5,00", info: "Grão especial single origin. Sem lactose.",              tags: ["sem lactose"] },
      { nome: "Cappuccino",                preco: "R$ 7,00", info: "Leite vaporizado e espuma cremosa. Contém laticínios.",  tags: ["contém laticínios"] },
      { nome: "Suco natural",              preco: "R$ 8,00", info: "Sabores variam conforme o dia — consultar balcão.",      tags: [] },
      { nome: "Achocolatado",              preco: "R$ 6,00", info: "Quente ou gelado. Contém laticínios.",                   tags: ["contém laticínios"] },
    ],
    especiais: [
      { nome: "Vinho (tinto/branco)", preco: "A partir de R$ 18,00 (taça)",    info: "Disponibilidade variável — consultar." },
      { nome: "Cerveja artesanal",    preco: "A partir de R$ 12,00 (garrafa)", info: "Disponibilidade variável — consultar." },
      { nome: "Licor caseiro",        preco: "R$ 10,00 (dose)",                info: "Disponibilidade variável — consultar." },
    ],
  },

  pagamento:      "Pix, dinheiro e cartão de débito/crédito (Visa, Master, Elo)",
  wifi:           "Disponível para clientes — senha no balcão",
  pets:           "Ambiente pet-friendly na área externa 🐾",
  estacionamento: "Sem estacionamento próprio; há rotativo disponível na rua",
  delivery:       "Não disponível no momento",
  encomendas:     "Aceitas com mínimo de 48h de antecedência, pelo telefone ou e-mail",
};

// ══════════════════════════════════════════════════════════════════════════════
//  🤖  SYSTEM PROMPT — instrução para a IA
// ══════════════════════════════════════════════════════════════════════════════
function buildSystemPrompt() {
  const todos = [
    ...PADARIA.cardapio.paes,
    ...PADARIA.cardapio.doces,
    ...PADARIA.cardapio.bebidas,
    ...PADARIA.cardapio.especiais,
  ];

  const cardapioTexto = todos
    .map(p => `- ${p.nome}: ${p.preco}${p.info ? " | " + p.info : ""}`)
    .join("\n");

  return `Você é a Luísa, atendente virtual simpática, animada e acolhedora da Padaria Pão de Cada Dia, em São Paulo.

== DADOS DA PADARIA ==
- Fundada em ${PADARIA.fundacao} por ${PADARIA.fundadora}, apaixonada por receitas de família
- Endereço: ${PADARIA.endereco}
- Telefone: ${PADARIA.telefone}
- E-mail: ${PADARIA.email}
- Horário: ${PADARIA.horario.semana} | ${PADARIA.horario.fds}
- Fornadas de pão a cada 40 minutos a partir das 6h
- Formas de pagamento: ${PADARIA.pagamento}
- Delivery: ${PADARIA.delivery}
- Encomendas: ${PADARIA.encomendas}
- Wi-Fi: ${PADARIA.wifi}
- Pets: ${PADARIA.pets}
- Estacionamento: ${PADARIA.estacionamento}

== CARDÁPIO COMPLETO ==
${cardapioTexto}

== REGRAS DE COMPORTAMENTO ==
Seja sempre concisa e objetiva. Respostas curtas têm preferência.
Nunca ultrapasse 5 frases por resposta, exceto quando listar o cardápio completo.
Sempre finalize cada resposta com uma frase completa. Nunca corte no meio de uma palavra ou frase.
Se precisar encurtar, resuma, mas termine de forma completa.

== REGRAS DE FORMATAÇÃO ==
Nunca escreva tudo em um parágrafo único — use quebras de linha para separar ideias.
Use <b>negrito</b> para destacar nomes de produtos, horários e informações importantes.
Quando recomendar produtos, liste cada um em uma linha separada com emoji no início.
Separe informações distintas (ex: recomendação + horário + despedida) com uma linha em branco entre elas.`;
}

// ══════════════════════════════════════════════════════════════════════════════
//  🕐  UTILITÁRIOS DE TEMPO
// ══════════════════════════════════════════════════════════════════════════════
function getAgora() {
  const d = new Date();
  return { h: d.getHours(), m: d.getMinutes(), total: d.getHours() * 60 + d.getMinutes(), diaSem: d.getDay() };
}
function isFds()      { return [0, 6].includes(getAgora().diaSem); }
function fimHoje()    { return isFds() ? PADARIA.horario.fimFds : PADARIA.horario.fimSemana; }
function estaAberto() { const t = getAgora().total; return t >= PADARIA.horario.inicioDia && t < fimHoje(); }

function saudacao() {
  const h = getAgora().h;
  if (h >= 5  && h < 12) return "Bom dia";
  if (h >= 12 && h < 18) return "Boa tarde";
  return "Boa noite";
}

function horaAtual() {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function calcularProximaFornada() {
  const { total } = getAgora();
  const inicio = PADARIA.horario.inicioDia;
  const fim    = fimHoje();
  if (total < inicio) return "A primeira fornada sai às 6h da manhã! 🌅";
  if (total >= fim)   return "As fornadas de hoje já encerraram. Amanhã a primeira sai às 6h! 😊";
  const ciclo      = Math.ceil((total - inicio + 1) / 40) * 40;
  const proximaMin = inicio + ciclo;
  const ph         = Math.floor(proximaMin / 60).toString().padStart(2, "0");
  const pm         = (proximaMin % 60).toString().padStart(2, "0");
  const faltam     = proximaMin - total;
  return `A próxima fornada sai às ${ph}h${pm === "00" ? "" : pm}, em aproximadamente ${faltam} minuto${faltam !== 1 ? "s" : ""}. 🍞`;
}

function contextoTempo() {
  const { h } = getAgora();
  const diaSemana = new Date().toLocaleDateString("pt-BR", { weekday: "long" });
  let periodo = "";
  if (h >= 6  && h < 10) periodo = "início da manhã (café da manhã)";
  else if (h >= 10 && h < 12) periodo = "final da manhã";
  else if (h >= 12 && h < 15) periodo = "hora do almoço/pós-almoço";
  else if (h >= 15 && h < 18) periodo = "lanche da tarde";
  else if (h >= 18 && h < 20) periodo = "final do dia";
  else periodo = "fora do horário de funcionamento";

  return `[Contexto atual: ${diaSemana}, ${horaAtual()}, ${periodo}. Padaria ${estaAberto() ? "ABERTA" : "FECHADA"}. ${calcularProximaFornada()}]`;
}

// ══════════════════════════════════════════════════════════════════════════════
//  📝  FALLBACK LOCAL — respostas sem IA
// ══════════════════════════════════════════════════════════════════════════════
function normalizar(t) {
  return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}

function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0)
  );
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[a.length][b.length];
}

function bate(normInput, palavras) {
  const tokens = normInput.split(" ");
  for (const kw of palavras) {
    const normKw = normalizar(kw);
    if (normInput.includes(normKw)) return true;
    if (normKw.length >= 4) {
      for (const token of tokens) {
        if (token.length >= 3) {
          const limiar = normKw.length <= 5 ? 1 : normKw.length <= 8 ? 2 : 3;
          if (levenshtein(token, normKw) <= limiar) return true;
        }
      }
    }
  }
  return false;
}

function variar(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

const FALLBACK_REGRAS = [
  { palavras: ["oi","ola","hey","eai","salve","bom dia","boa tarde","boa noite","tudo bem"],
    resposta: () => `${saudacao()}! 👋 Sou a Luísa, da Pão de Cada Dia. Como posso te ajudar?` },
  { palavras: ["horario","abre","fecha","funcionamento","aberto","fechado","quando abre","quando fecha"],
    resposta: () => `${estaAberto() ? "✅ Estamos abertos agora!" : "⛔ Estamos fechados no momento."}\n\n🕕 ${PADARIA.horario.semana}\n🕕 ${PADARIA.horario.fds}` },
  { palavras: ["fornada","pao quente","pao fresco","forno","quando sai","proxima fornada"],
    resposta: () => calcularProximaFornada() },
  { palavras: ["cardapio","menu","o que tem","o que vende","tem o que","catalogo","todos os produtos"],
    resposta: () => {
      const c = PADARIA.cardapio;
      return "🍞 <b>Pães & Salgados</b>\n" + c.paes.map(p=>`• ${p.nome} — ${p.preco}`).join("\n") +
        "\n\n🍰 <b>Bolos & Doces</b>\n" + c.doces.map(p=>`• ${p.nome} — ${p.preco}`).join("\n") +
        "\n\n☕ <b>Bebidas</b>\n" + c.bebidas.map(p=>`• ${p.nome} — ${p.preco}`).join("\n") +
        "\n\n🍷 <b>Bebidas Especiais</b>\n" + c.especiais.map(p=>`• ${p.nome} — ${p.preco}`).join("\n");
    }},
  { palavras: ["preco","valor","quanto custa","quanto e","custa","precos","tabela"],
    resposta: () => {
      const todos = [...PADARIA.cardapio.paes,...PADARIA.cardapio.doces,...PADARIA.cardapio.bebidas,...PADARIA.cardapio.especiais];
      return "💰 <b>Tabela de preços:</b>\n" + todos.map(p=>`• ${p.nome} — ${p.preco}`).join("\n");
    }},
  { palavras: ["sem gluten","celiaco","gluten"],
    resposta: () => {
      const itens = [...PADARIA.cardapio.paes,...PADARIA.cardapio.doces].filter(p=>p.tags.includes("sem glúten"));
      return "🌾 <b>Opções sem glúten:</b>\n" + itens.map(p=>`• ${p.nome} — ${p.preco}\n  <i>${p.info}</i>`).join("\n");
    }},
  { palavras: ["vegano","vegana","sem carne"],
    resposta: () => {
      const itens = [...PADARIA.cardapio.paes,...PADARIA.cardapio.doces].filter(p=>p.tags.includes("vegano"));
      return "🌱 <b>Opções veganas:</b>\n" + itens.map(p=>`• ${p.nome} — ${p.preco}\n  <i>${p.info}</i>`).join("\n");
    }},
  { palavras: ["sem lactose","lactose"],
    resposta: () => {
      const itens = [...PADARIA.cardapio.paes,...PADARIA.cardapio.doces,...PADARIA.cardapio.bebidas].filter(p=>p.tags.includes("sem lactose"));
      return "🥛 <b>Opções sem lactose:</b>\n" + itens.map(p=>`• ${p.nome} — ${p.preco}\n  <i>${p.info}</i>`).join("\n");
    }},
  { palavras: ["endereco","onde fica","localizacao","como chegar","rua","bairro","mapa"],
    resposta: () => `📍 <b>Nossa localização:</b>\n${PADARIA.endereco}\n\n📞 ${PADARIA.telefone}\n📧 ${PADARIA.email}` },
  { palavras: ["telefone","contato","whatsapp","zap","email","falar","ligar"],
    resposta: () => `📞 <b>${PADARIA.telefone}</b>\n📧 ${PADARIA.email}` },
  { palavras: ["pagamento","pagar","pix","dinheiro","cartao","credito","debito"],
    resposta: () => `💳 <b>Formas de pagamento:</b>\n${PADARIA.pagamento}` },
  { palavras: ["delivery","entrega","ifood","rappi"],
    resposta: () => `🛵 ${PADARIA.delivery}.\n\nMas pode nos visitar! 📍 ${PADARIA.endereco}` },
  { palavras: ["encomenda","encomendar","reserva","aniversario","festa"],
    resposta: () => `🎂 Aceitamos encomendas!\n\n${PADARIA.encomendas}.\n\n📞 ${PADARIA.telefone}\n📧 ${PADARIA.email}` },
  { palavras: ["wifi","internet","senha wifi"],
    resposta: () => `📶 ${PADARIA.wifi}` },
  { palavras: ["pet","cachorro","gato","animal"],
    resposta: () => `🐾 ${PADARIA.pets}` },
  { palavras: ["historia","fundadora","dona lucia","quem fundou","sobre"],
    resposta: () => `🏡 A Pão de Cada Dia nasceu em ${PADARIA.fundacao}, fundada por ${PADARIA.fundadora} — apaixonada por receitas de família. Começamos com um pequeno forno e muita dedicação! ❤️` },
  { palavras: ["obrigado","obrigada","valeu","grato","brigado"],
    resposta: () => variar(["Por nada! 😊 Venha nos visitar! 🥐","Disponha! 🍞 Qualquer dúvida é só chamar."]) },
  { palavras: ["tchau","ate logo","xau","bye","ate mais"],
    resposta: () => variar(["Até logo! 😊 Venha provar nosso pão fresquinho! 🍞❤️","Tchau tchau! 👋 Esperamos te ver em breve!"]) },
];

function respostaFallback(texto) {
  const norm = normalizar(texto);
  for (const r of FALLBACK_REGRAS) {
    if (bate(norm, r.palavras)) return r.resposta();
  }
  return variar([
    `Hmm, não entendi! 😅 Use o menu abaixo ou pergunte sobre horários, cardápio ou contato.`,
    `Não entendi direito. 🤔 Posso ajudar com cardápio, horários, fornadas ou recomendações!\nOu ligue: 📞 ${PADARIA.telefone}`,
  ]);
}

// ══════════════════════════════════════════════════════════════════════════════
//  🌐  CHAMADA À API DO GEMINI
// ══════════════════════════════════════════════════════════════════════════════
// Histórico no formato Gemini: [{role:"user"|"model", parts:[{text:"..."}]}]
let historicoGemini = [];

async function chamarGemini(textoUsuario) {
  // Monta a mensagem do usuário com contexto de tempo injetado
  const mensagemComContexto = `${contextoTempo()}\n\nUsuário: ${textoUsuario}`;

  // Adiciona ao histórico
  historicoGemini.push({ role: "user", parts: [{ text: mensagemComContexto }] });

  // Limita o histórico
  if (historicoGemini.length > CONFIG.MAX_HISTORICO * 2) {
    historicoGemini = historicoGemini.slice(-CONFIG.MAX_HISTORICO * 2);
  }

  // Chama o proxy seguro — a chave fica no servidor
  const url = "/api/gemini";

  const body = {
    model: CONFIG.GEMINI_MODEL,         // ✅ modelo agora é enviado ao proxy
    system_instruction: {
      parts: [{ text: buildSystemPrompt() }],
    },
    contents: historicoGemini,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 512,             // ✅ reduzido de 2048 → respostas mais rápidas
      topP: 0.9,
      topK: 40,                         // ✅ adicionado → acelera a inferência
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT",        threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HATE_SPEECH",       threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
    ],
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${res.status}`);
  }

  const data = await res.json();
  const candidate = data?.candidates?.[0];
  const resposta  = candidate?.content?.parts?.[0]?.text;
  const finishReason = candidate?.finishReason;

  if (!resposta) throw new Error("Resposta vazia da API");

  // Se a IA foi cortada pelo limite de tokens, avisa o usuário de forma elegante
  if (finishReason === "MAX_TOKENS") {
    const respostaTratada = resposta.trim() + "...\n\n📞 Para mais detalhes, ligue: " + PADARIA.telefone;
    historicoGemini.push({ role: "model", parts: [{ text: respostaTratada }] });
    return respostaTratada;
  }

  // Salva resposta da IA no histórico
  historicoGemini.push({ role: "model", parts: [{ text: resposta }] });

  return resposta.trim();
}

// ══════════════════════════════════════════════════════════════════════════════
//  🧠  PROCESSADOR PRINCIPAL
// ══════════════════════════════════════════════════════════════════════════════
let modoFallback = false; // ativa fallback permanente se API falhar repetidamente
let falhasConsecutivas = 0;

async function processarMensagem(texto) {
  if (modoFallback) return respostaFallback(texto);

  try {
    const resposta = await chamarGemini(texto);
    falhasConsecutivas = 0;
    return resposta;
  } catch (erro) {
    falhasConsecutivas++;
    console.warn(`[Chatbot] Falha na API (${falhasConsecutivas}x):`, erro.message);

    // Após 3 falhas consecutivas, entra em modo fallback permanente
    if (falhasConsecutivas >= 3) {
      modoFallback = true;
      console.warn("[Chatbot] Modo fallback ativado permanentemente.");
    }

    return respostaFallback(texto);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  🎨  WIDGET HTML
// ══════════════════════════════════════════════════════════════════════════════
const widget = document.createElement("div");
widget.id = "chat-widget";
widget.innerHTML = `
  <button id="chat-fab" title="Falar com a Luísa">🍞</button>

  <div id="chat-janela" role="dialog" aria-label="Chat com a Luísa">

    <div id="chat-header">
      <div class="avatar">🥐</div>
      <div class="info">
        <div class="nome">Luísa — Pão de Cada Dia</div>
        <div class="status" id="chat-status">Carregando...</div>
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
      <button class="menu-item" data-msg="O que você recomenda agora?"><span class="icone">⭐</span> Recomendação</button>
      <button class="menu-item" data-msg="Quais são os preços?"><span class="icone">💰</span> Preços</button>
      <button class="menu-item" data-msg="Como posso pagar?"><span class="icone">💳</span> Pagamento</button>
      <button class="menu-item" data-msg="Tem opção sem glúten?"><span class="icone">🌾</span> Sem glúten</button>
      <button class="menu-item" data-msg="Tem opção vegana?"><span class="icone">🌱</span> Vegano</button>
      <button class="menu-item" data-msg="Vocês fazem encomendas?"><span class="icone">🎂</span> Encomendas</button>
      <button class="menu-item" data-msg="Vocês fazem delivery?"><span class="icone">🛵</span> Delivery</button>
      <button class="menu-item" data-msg="Qual o endereço e contato?"><span class="icone">📍</span> Endereço</button>
      <button class="menu-item" data-msg="Me conta a história da padaria"><span class="icone">📖</span> Nossa história</button>
    </div>

    <div id="chat-footer">
      <button id="chat-voltar-menu">☰ Ver opções</button>
      <div id="chat-input-area">
        <textarea id="chat-input" rows="1" placeholder="Digite sua mensagem..." aria-label="Mensagem"></textarea>
        <button id="chat-enviar" aria-label="Enviar">➤</button>
      </div>
    </div>

  </div>
`;
document.body.appendChild(widget);

// ══════════════════════════════════════════════════════════════════════════════
//  🔗  REFERÊNCIAS
// ══════════════════════════════════════════════════════════════════════════════
const fab       = document.getElementById("chat-fab");
const janela    = document.getElementById("chat-janela");
const msgs      = document.getElementById("chat-msgs");
const input     = document.getElementById("chat-input");
const btnEnviar = document.getElementById("chat-enviar");
const menuEl    = document.getElementById("chat-menu");
const voltarBtn = document.getElementById("chat-voltar-menu");
const statusEl  = document.getElementById("chat-status");

// ══════════════════════════════════════════════════════════════════════════════
//  📡  STATUS DINÂMICO
// ══════════════════════════════════════════════════════════════════════════════
function atualizarStatus() {
  if (modoFallback) {
    statusEl.textContent = estaAberto() ? "✅ Abertos agora" : "⛔ Fechados";
    statusEl.style.color = estaAberto() ? "#4caf50" : "#f44336";
  } else {
    statusEl.textContent = estaAberto() ? "✅ Online • Abertos agora" : "⚡ Online • Fechados";
    statusEl.style.color = estaAberto() ? "#4caf50" : "#f44336";
  }
}
atualizarStatus();
setInterval(atualizarStatus, 60_000);

// ══════════════════════════════════════════════════════════════════════════════
//  🖼️  FUNÇÕES DE UI
// ══════════════════════════════════════════════════════════════════════════════
function adicionarBolha(html, tipo) {
  const wrap = document.createElement("div");
  wrap.className = `bolha-wrap ${tipo}`;
  const avatar = tipo === "bot" ? `<div class="mini-avatar">🥐</div>` : "";
  wrap.innerHTML = `
    <div class="bolha-inner">
      ${avatar}
      <div class="bolha">${html.replace(/\n/g, "<br>")}</div>
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
  document.getElementById("digitando")?.remove();
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

let menuVisivel = true;

function mensagemBoaVinda() {
  const sep = document.createElement("div");
  sep.className = "data-sep";
  sep.textContent = new Date().toLocaleDateString("pt-BR", {
    weekday: "long", day: "numeric", month: "long",
  });
  msgs.appendChild(sep);

  adicionarBolha(
    `${saudacao()}! 👋 Sou a <b>Luísa</b>, atendente da Padaria Pão de Cada Dia. 🥐<br><br>Pode perguntar qualquer coisa ou escolher uma opção no menu!`,
    "bot"
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  📨  ENVIO DE MENSAGEM
// ══════════════════════════════════════════════════════════════════════════════
let enviando = false;

async function enviar(textoFixo) {
  if (enviando) return;
  const texto = textoFixo || input.value.trim();
  if (!texto) return;

  enviando = true;
  input.value = "";
  input.style.height = "auto";
  btnEnviar.disabled = true;
  input.disabled = true;

  esconderMenu();
  adicionarBolha(texto, "usuario");
  mostrarDigitando();

  try {
    const resposta = await processarMensagem(texto);
    removerDigitando();
    adicionarBolha(resposta, "bot");
    atualizarStatus();
  } catch (e) {
    removerDigitando();
    adicionarBolha(`Desculpe, tive um problema. Ligue: 📞 ${PADARIA.telefone}`, "bot");
  }

  enviando = false;
  btnEnviar.disabled = false;
  input.disabled = false;
  input.focus();
}

// ══════════════════════════════════════════════════════════════════════════════
//  🎮  EVENTOS
// ══════════════════════════════════════════════════════════════════════════════
let chatAberto = false;

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
  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviar(); }
});

input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = Math.min(input.scrollHeight, 100) + "px";
});

document.querySelectorAll(".menu-item").forEach(btn => {
  btn.addEventListener("click", () => enviar(btn.dataset.msg));
});