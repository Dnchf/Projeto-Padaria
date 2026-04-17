// ============================================================
//  CHATBOT IA — Pão de Cada Dia  |  Powered by Gemini
//  Funciona direto no GitHub Pages (sem backend)
//
//  COMO USAR:
//  1. Cole sua chave do Gemini na variável GEMINI_API_KEY abaixo
//  2. Adicione no final do <body> do seu HTML:
//     <script src="chatbot-gemini.js"></script>
//  3. Remova ou desative o chatbot antigo
// ============================================================

const GEMINI_API_KEY = window.MY_CHATBOT_KEY || prompt("Digite sua API Key do Gemini para ativar o chat:");


const SYSTEM_PROMPT = `
Você é a Luísa, atendente virtual simpática e acolhedora da Padaria Pão de Cada Dia.
Fundada em 2022 por Dona Lúcia, a padaria é tradicional, artesanal e cheia de carinho.

HORÁRIO DE FUNCIONAMENTO:
- Segunda a sexta: 6h às 20h
- Sábado e domingo: 6h às 14h

CARDÁPIO E PREÇOS:
Pães & Salgados:
- Pão Francês: R$ 0,80/unidade
- Croissant: R$ 4,00/unidade
- Brioche: R$ 3,50/unidade
- Salgados variados: pergunte ao balcão

Bolos & Doces:
- Bolo de Cenoura com cobertura de chocolate: R$ 28,00
- Bolo de Coco Cremoso: R$ 32,00
- Brownie com sorvete: R$ 4,30

Bebidas:
- Café artesanal: R$ 5,00
- Suco natural: R$ 8,00
- Achocolatado: R$ 6,00
- Vinho, licor e cerveja artesanal: consulte disponibilidade

FORNADA DE PÃO:
- As fornadas saem a cada 40 minutos a partir das 6h
- Se o cliente perguntar, calcule a próxima fornada com base no horário atual

CONTATO E LOCALIZAÇÃO:
- Endereço: Rua dos Padeiros, 123
- Telefone: (11) 99999-9999
- Email: contato@paodecadadia.com

REGRAS DE ATENDIMENTO:
- Seja calorosa, use emojis com moderação
- Responda em português do Brasil
- Se não souber algo, diga "vou verificar com nossa equipe!"
- Não invente preços ou informações que não estão acima
- Respostas curtas e diretas, no máximo 3 parágrafos
- Quando perguntarem sobre a próxima fornada, use o horário atual para calcular
`;

// ──────────────────────────────────────────────
//  ESTADO DO CHAT
// ──────────────────────────────────────────────
let historico = [];
let chatAberto = false;

// ──────────────────────────────────────────────
//  CÁLCULO DA PRÓXIMA FORNADA
// ──────────────────────────────────────────────
function calcularProximaFornada() {
  const agora = new Date();
  const horas = agora.getHours();
  const minutos = agora.getMinutes();
  const totalMin = horas * 60 + minutos;
  const inicio = 6 * 60; // 6h
  const fim = 20 * 60;   // 20h

  if (totalMin < inicio) return "A primeira fornada sai às 6h!";
  if (totalMin >= fim) return "As fornadas já encerraram por hoje. Amanhã começa às 6h!";

  const minDesde6h = totalMin - inicio;
  const ciclo = 40;
  const proximosCiclos = Math.ceil((minDesde6h + 1) / ciclo) * ciclo;
  const proximaFornada = inicio + proximosCiclos;
  const h = Math.floor(proximaFornada / 60).toString().padStart(2, "0");
  const m = (proximaFornada % 60).toString().padStart(2, "0");
  const faltam = proximaFornada - totalMin;
  return `A próxima fornada sai às ${h}h${m === "00" ? "" : m} (em aproximadamente ${faltam} minuto${faltam !== 1 ? "s" : ""}). 🍞`;
}


async function chamarGemini(mensagemUsuario) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

 
  const conteudo = historico.map(msg => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }]
  }));

  // Adiciona a mensagem atual
  conteudo.push({ role: "user", parts: [{ text: mensagemUsuario }] });

  const body = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: conteudo,
    generationConfig: {
      maxOutputTokens: 400,
      temperature: 0.7
    }
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.json();
    console.error("Erro Gemini:", err);
    throw new Error("Erro na API do Gemini");
  }

  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}

// ──────────────────────────────────────────────
//  INJEÇÃO DO CSS
// ──────────────────────────────────────────────
const estilos = document.createElement("style");
estilos.textContent = `
  #chat-widget * { box-sizing: border-box; margin: 0; padding: 0; font-family: inherit; }

  #chat-fab {
    position: fixed; bottom: 24px; right: 24px;
    width: 56px; height: 56px; border-radius: 50%;
    background: #8B4513; color: #fff; border: none;
    cursor: pointer; font-size: 24px; z-index: 9998;
    box-shadow: 0 4px 16px rgba(0,0,0,0.25);
    display: flex; align-items: center; justify-content: center;
    transition: transform 0.2s, background 0.2s;
  }
  #chat-fab:hover { background: #6B3410; transform: scale(1.08); }

  #chat-janela {
    position: fixed; bottom: 92px; right: 24px;
    width: 360px; max-height: 520px;
    background: #fff; border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
    display: flex; flex-direction: column;
    z-index: 9999; overflow: hidden;
    transform: scale(0.9) translateY(20px);
    opacity: 0; pointer-events: none;
    transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }
  #chat-janela.aberto {
    transform: scale(1) translateY(0);
    opacity: 1; pointer-events: all;
  }

  #chat-header {
    background: #8B4513; color: #fff;
    padding: 14px 16px; display: flex;
    align-items: center; gap: 10px;
    border-radius: 16px 16px 0 0;
  }
  #chat-header .avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
  }
  #chat-header .info .nome { font-size: 14px; font-weight: 600; }
  #chat-header .info .status { font-size: 11px; opacity: 0.85; display: flex; align-items: center; gap: 4px; }
  #chat-header .info .status::before {
    content: ""; width: 7px; height: 7px; border-radius: 50%;
    background: #4ade80; display: inline-block;
  }
  #chat-fechar {
    margin-left: auto; background: none; border: none;
    color: rgba(255,255,255,0.8); font-size: 20px;
    cursor: pointer; line-height: 1; padding: 4px;
  }
  #chat-fechar:hover { color: #fff; }

  #chat-msgs {
    flex: 1; overflow-y: auto; padding: 14px;
    display: flex; flex-direction: column; gap: 10px;
    background: #faf8f5;
    scrollbar-width: thin; scrollbar-color: #d4b896 transparent;
  }

  .bolha-wrap { display: flex; flex-direction: column; }
  .bolha-wrap.usuario { align-items: flex-end; }
  .bolha-wrap.bot { align-items: flex-start; }

  .bolha {
    max-width: 82%; padding: 9px 13px;
    border-radius: 16px; font-size: 13.5px; line-height: 1.55;
    word-break: break-word;
  }
  .bolha-wrap.bot .bolha {
    background: #fff; color: #2d1a0e;
    border: 1px solid #e8d9c8;
    border-radius: 4px 16px 16px 16px;
  }
  .bolha-wrap.usuario .bolha {
    background: #8B4513; color: #fff;
    border-radius: 16px 4px 16px 16px;
  }
  .hora {
    font-size: 10px; color: #a89070;
    margin-top: 3px; padding: 0 4px;
  }

  .digitando {
    display: flex; align-items: center; gap: 5px;
    padding: 10px 13px; background: #fff;
    border: 1px solid #e8d9c8;
    border-radius: 4px 16px 16px 16px;
    width: fit-content;
  }
  .digitando span {
    width: 7px; height: 7px; border-radius: 50%;
    background: #8B4513; opacity: 0.4;
    animation: pulsa 1.2s infinite;
  }
  .digitando span:nth-child(2) { animation-delay: 0.2s; }
  .digitando span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes pulsa {
    0%, 60%, 100% { opacity: 0.4; transform: scale(1); }
    30% { opacity: 1; transform: scale(1.3); }
  }

  .botoes-rapidos {
    display: flex; flex-wrap: wrap; gap: 6px; padding: 10px 14px 4px;
    background: #faf8f5;
  }
  .btn-rapido {
    background: #fff; border: 1px solid #d4b896;
    color: #6B3410; border-radius: 20px;
    padding: 5px 12px; font-size: 12px;
    cursor: pointer; transition: background 0.15s, color 0.15s;
    white-space: nowrap;
  }
  .btn-rapido:hover { background: #8B4513; color: #fff; border-color: #8B4513; }

  #chat-input-area {
    padding: 10px 12px; border-top: 1px solid #e8d9c8;
    display: flex; gap: 8px; background: #fff;
  }
  #chat-input {
    flex: 1; border: 1px solid #e0d0be; border-radius: 22px;
    padding: 9px 14px; font-size: 13px; color: #2d1a0e;
    background: #faf8f5; outline: none; resize: none;
    transition: border-color 0.2s;
  }
  #chat-input:focus { border-color: #8B4513; }
  #chat-enviar {
    width: 38px; height: 38px; border-radius: 50%;
    background: #8B4513; color: #fff; border: none;
    cursor: pointer; font-size: 16px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s, transform 0.15s;
    align-self: flex-end;
  }
  #chat-enviar:hover { background: #6B3410; }
  #chat-enviar:active { transform: scale(0.92); }
  #chat-enviar:disabled { background: #ccc; cursor: not-allowed; }

  @media (max-width: 420px) {
    #chat-janela { width: calc(100vw - 24px); right: 12px; bottom: 84px; }
    #chat-fab { bottom: 16px; right: 16px; }
  }
`;
document.head.appendChild(estilos);

// ──────────────────────────────────────────────
//  ESTRUTURA HTML DO CHAT
// ──────────────────────────────────────────────
const widget = document.createElement("div");
widget.id = "chat-widget";
widget.innerHTML = `
  <button id="chat-fab" title="Falar com atendente">🍞</button>

  <div id="chat-janela" role="dialog" aria-label="Chat com atendente">
    <div id="chat-header">
      <div class="avatar">🥐</div>
      <div class="info">
        <div class="nome">Luísa — Pão de Cada Dia</div>
        <div class="status">Online agora</div>
      </div>
      <button id="chat-fechar" aria-label="Fechar chat">✕</button>
    </div>

    <div id="chat-msgs"></div>

    <div class="botoes-rapidos" id="botoes-rapidos">
      <button class="btn-rapido" data-msg="Qual o horário de funcionamento?">🕐 Horário</button>
      <button class="btn-rapido" data-msg="Me mostra o cardápio completo">🥖 Cardápio</button>
      <button class="btn-rapido" data-msg="Quando sai a próxima fornada de pão?">🍞 Próxima fornada</button>
      <button class="btn-rapido" data-msg="Qual o endereço e contato?">📍 Contato</button>
    </div>

    <div id="chat-input-area">
      <textarea id="chat-input" rows="1" placeholder="Digite sua mensagem..." aria-label="Mensagem"></textarea>
      <button id="chat-enviar" aria-label="Enviar">➤</button>
    </div>
  </div>
`;
document.body.appendChild(widget);

// ──────────────────────────────────────────────
//  FUNÇÕES DE UI
// ──────────────────────────────────────────────
const janela = document.getElementById("chat-janela");
const msgs = document.getElementById("chat-msgs");
const input = document.getElementById("chat-input");
const btnEnviar = document.getElementById("chat-enviar");

function horaAtual() {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function adicionarBolha(texto, tipo) {
  const wrap = document.createElement("div");
  wrap.className = `bolha-wrap ${tipo}`;
  wrap.innerHTML = `<div class="bolha">${texto.replace(/\n/g, "<br>")}</div><span class="hora">${horaAtual()}</span>`;
  msgs.appendChild(wrap);
  msgs.scrollTop = msgs.scrollHeight;
  return wrap;
}

function mostrarDigitando() {
  const wrap = document.createElement("div");
  wrap.className = "bolha-wrap bot";
  wrap.id = "digitando";
  wrap.innerHTML = `<div class="digitando"><span></span><span></span><span></span></div>`;
  msgs.appendChild(wrap);
  msgs.scrollTop = msgs.scrollHeight;
}

function removerDigitando() {
  const el = document.getElementById("digitando");
  if (el) el.remove();
}

function mensagemBoaVinda() {
  const hora = new Date().getHours();
  let saudacao = "Olá";
  if (hora >= 5 && hora < 12) saudacao = "Bom dia";
  else if (hora >= 12 && hora < 18) saudacao = "Boa tarde";
  else saudacao = "Boa noite";

  adicionarBolha(`${saudacao}! Sou a Luísa, atendente virtual da Padaria Pão de Cada Dia. 🥐\n\nComo posso te ajudar hoje?`, "bot");
}

// ──────────────────────────────────────────────
//  ENVIO DE MENSAGEM
// ──────────────────────────────────────────────
async function enviar(textoFixo) {
  const texto = textoFixo || input.value.trim();
  if (!texto) return;

  input.value = "";
  input.style.height = "auto";
  btnEnviar.disabled = true;

  // Esconde botões rápidos após primeira interação
  document.getElementById("botoes-rapidos").style.display = "none";

  adicionarBolha(texto, "usuario");
  mostrarDigitando();

  try {
    // Enriquece com informação da fornada se necessário
    let mensagemEnriquecida = texto;
    if (/fornada|pão quente|pão fresco|sai.*pão|pão.*sai/i.test(texto)) {
      const infoFornada = calcularProximaFornada();
      mensagemEnriquecida = `${texto}\n[Contexto automático para você usar na resposta: ${infoFornada}]`;
    }

    const resposta = await chamarGemini(mensagemEnriquecida);

    // Salva no histórico (sem o contexto enriquecido)
    historico.push({ role: "user", content: texto });
    historico.push({ role: "assistant", content: resposta });

    // Mantém só as últimas 12 mensagens para economizar tokens
    if (historico.length > 12) historico = historico.slice(-12);

    removerDigitando();
    adicionarBolha(resposta, "bot");

  } catch (err) {
    removerDigitando();
    adicionarBolha("Ops, tive um problema de conexão. Tenta de novo em instantes! 😅", "bot");
    console.error(err);
  }

  btnEnviar.disabled = false;
  input.focus();
}

// ──────────────────────────────────────────────
//  EVENTOS
// ──────────────────────────────────────────────
document.getElementById("chat-fab").addEventListener("click", () => {
  chatAberto = !chatAberto;
  janela.classList.toggle("aberto", chatAberto);
  if (chatAberto && msgs.children.length === 0) {
    mensagemBoaVinda();
  }
  if (chatAberto) input.focus();
});

document.getElementById("chat-fechar").addEventListener("click", () => {
  chatAberto = false;
  janela.classList.remove("aberto");
});

btnEnviar.addEventListener("click", () => enviar());

input.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    enviar();
  }
});

// Auto-resize do textarea
input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = Math.min(input.scrollHeight, 100) + "px";
});

// Botões rápidos
document.querySelectorAll(".btn-rapido").forEach(btn => {
  btn.addEventListener("click", () => enviar(btn.dataset.msg));
});
