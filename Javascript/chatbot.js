const botao = document.getElementById("chatbot-icone")
const container = document.getElementById("chatbot-container")
const mensagem = document.getElementById("chatbot-input")
const mensagens = document.getElementById("chatbot-mensagens")

let primeiraVez = true

botao.addEventListener("click", () => {

    if (container.style.display !== "block") {
        container.style.display = "block"

        if (primeiraVez) {
            mensagens.innerHTML += "<div class='bot'>Olá! Bem vindo(a) a Padaria Pão de Cada Dia 👋</div>"
            mensagens.innerHTML += "<div class='bot'>Digite: horario, endereço, pão, bolos, doces, salgados, bebidas</div>"
            mensagens.scrollTop = mensagens.scrollHeight
            primeiraVez = false
        }

    } else {
        container.style.display = "none"
    }

})

mensagem.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {

        const texto = mensagem.value.toLowerCase().trim()

        if (texto !== "") {

            let respondeu = false

            // mensagem do usuário
            mensagens.innerHTML += "<div class='user'>" + texto + "</div>"
            mensagens.scrollTop = mensagens.scrollHeight

            mensagem.value = ""

        

            // ENDEREÇO
            if (texto.includes("endereco") || texto.includes("endereço")) {
                mensagens.innerHTML += "<div class='bot'>📍 Estamos na Rua dos Padeiros, 123 - Centro</div>"
                respondeu = true
            }

            // HORÁRIO
            if (texto.includes("horario")) {
                mensagens.innerHTML += "<div class='bot'>🕖 Funcionamos das 7h às 20h</div>"
                respondeu = true
            }

            // PÃES
            if (texto.includes("pao") || texto.includes("pão") || texto.includes("paes")) {
                mensagens.innerHTML += "<div class='bot'>Temos os seguintes pães:</div>"
                mensagens.innerHTML += "<div class='bot'> Pão francês - R$ 0,80/unidade</div>"
                mensagens.innerHTML += "<div class='bot'> Pão de queijo - R$ 1,50/unidade</div>"
                mensagens.innerHTML += "<div class='bot'> Pão de forma - R$ 6,00/unidade</div>"
                mensagens.innerHTML += "<div class='bot'> Pão Australiano - R$ 4,00/unidade </div> "
                mensagens.innerHTML += "<div class='bot'> Croissant - R$ 4,00/unidade</div>"
                mensagens.innerHTML += "<div class='bot'> Pão integral - R$ 5,00/unidade</div>"
                mensagens.innerHTML += "<div class='bot'> Pão de Brioche - R$ 3,50/unidade</div>"
                mensagens.innerHTML += "<div class='bot'> Baguete - R$ 7,00/unidade</div>"
                mensagens.innerHTML += "<div class='bot'> Pães Artesanais - R$ 4,50/unidade</div>"
                mensagens.innerHTML += "<div class='bot'> Nossa proxima fornada sai daqui 30 á 60 minutos 🥖 </div>"
                respondeu = true
            }

            // BOLOS
            if (texto.includes("bolo") || texto.includes("bolos")) {
                mensagens.innerHTML += "<div class='bot'>Temos os seguintes bolos:</div>"
                mensagens.innerHTML += "<div class='bot'> Brownie - R$ 4,30</div>"
                mensagens.innerHTML += "<div class='bot'>Bolo de Coco - R$ 12,00/fatia</div>"
                mensagens.innerHTML += "<div class='bot'>Bolo de Cenoura - R$ 12,00/fatia</div>"
                respondeu = true
            }
            //DOCES
            if (texto.includes("Doces") || texto.includes("Doce") || texto.includes("doce") || texto.includes("doces"))  {
                mensagens.innerHTML += "<div class='bot'>Temos os seguintes doces:</div>"
                mensagens.innerHTML += "<div class='bot'>Torta Holandesa - R$ 14,00/fatia</div>"
                mensagens.innerHTML += "<div class='bot'>Folhado de goiabada - R$ 10,00/unidade</div>"
                mensagens.innerHTML += "<div class='bot'>Torta de limão - R$ 14,00/fatia </div>"
                mensagens.innerHTML += "<div class='bot'>Chessecake - R$ 14,00/fatia</div>"
                mensagens.innerHTML += "<div class='bot'>Mil-Folhas - R$ 14,00/fatia</div>"
                mensagens.innerHTML += "<div class='bot'>Sonho - R$ 10,00/unidade</div>"
                respondeu = true
            }
            //SALGADOS
            if (texto.includes("Salgados") || texto.includes("salgados") || texto.includes("salgado")) {
                mensagens.innerHTML += "<div class='bot'>Temos os seguintes Salgados:</div>"
                mensagens.innerHTML += "<div class='bot'>Coxinha Clássica R$ 1,50/unidade</div>"
                mensagens.innerHTML += "<div class='bot'>Enrolado R$ 4,00/unidade </div>"
                mensagens.innerHTML += "<div class='bot'>Folhado de frango R$ 5,50/unidade</div>"
                mensagens.innerHTML += "<div class='bot'>Misto Quente R$ 6,00/unidade</div>"
                mensagens.innerHTML += "<div class='bot'>Risole de camarão R$ 4,50/unidade</div>"
                mensagens.innerHTML += "<div class='bot'>Croissant salgado R$ 3,50/unidade</div>"
                respondeu = true
            }

            // BEBIDAS
            if (texto.includes("bebida") || texto.includes("bebidas")) {
                mensagens.innerHTML += "<div class='bot'>Temos as seguintes bebidas:</div>"
                mensagens.innerHTML += "<div class='bot'> Café Artesanal - A partir de R$ 5,00</div>"
                mensagens.innerHTML += "<div class='bot'> Cappuccino com chocolate - A partir de R$ 6,00</div>"
                mensagens.innerHTML += "<div class='bot'> Suco de melancia - A partir de R$ 4,00</div>"
                mensagens.innerHTML += "<div class='bot'> Suco LaraMora - A partir de R$ 6,00</div>"
                mensagens.innerHTML += "<div class='bot'> Café gelado com chocolate - A partir de R$ 6,00</div>"
                mensagens.innerHTML += "<div class='bot'> Frappuccino - A partir de R$ 8,00</div>"
                mensagens.innerHTML += "<div class='bot'> Temos tambem as seguintes bebidas  alcoólicas: </div>"
                mensagens.innerHTML += "<div class='bot'> Vinho tinto R$ 55,00/garrafa </div>"
                mensagens.innerHTML += "<div class='bot'> Caipirinha R$ 20,00/copo </div>"
                mensagens.innerHTML += "<div class='bot'> Vinho Rosé R$ 60,00/garrafa </div>"
                mensagens.innerHTML += "<div class='bot'> Cerveja Artesanal R$ 40,00/garrafa  </div>"
                mensagens.innerHTML += "<div class='bot'> Licor R$ 70,00/garrafa  </div>"
                mensagens.innerHTML += "<div class='bot'> Hidromel R$ 55,00/garrafa  </div>"
                respondeu = true
            }

            // RESPOSTA PADRÃO
            if (!respondeu) {
                mensagens.innerHTML += "<div class='bot'>Não entendi 😅</div>"
                mensagens.innerHTML += "<div class='bot'>Digite novamente sua duvida: horario, endereço, pão, bolos, doces, salgados, bebidas</div>"
            }

            // scroll final
            mensagens.scrollTop = mensagens.scrollHeight
        }
    }
})