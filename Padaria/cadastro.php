<?php
// Inclui o arquivo de conexão
include("conexao.php");

// Verifica se os dados foram enviados via método POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtém os valores do formulário
    $email = isset($_POST['email']) ? $_POST['email'] : '';
    $senha = isset($_POST['senha']) ? $_POST['senha'] : '';

    // Verifica se os campos não estão vazios
    if (!empty($email) && !empty($senha)) {
        // Criptografa a senha para maior segurança
        $senha_hash = password_hash($senha, PASSWORD_DEFAULT);

        // Monta a query de inserção
        $sql = "INSERT INTO clientes (email, senha) VALUES ('$email', '$senha_hash')";

        // Executa a query e verifica se foi bem-sucedida
        if (mysqli_query($conexao, $sql)) {
            // Cadastro bem-sucedido, não exibe mensagem
        } else {
            // Erro no cadastro (pode opcionalmente definir mensagens para debug interno)
        }

        // Fecha a conexão
        mysqli_close($conexao);
    } else {
        // Se os campos estiverem vazios, simplesmente mantém o comportamento existente
    }
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Login - Pão de Cada Dia</title>
  <link rel="stylesheet" href="./Styles/Login style.css">
</head>
<body>
  <section class="login-section">
    <div class="login-box">
      <h2 class="login-titulo">🍞 Login do Cliente</h2>
      
      <!-- Aqui adicionamos action e method -->
      <form action="cadastro.php" method="POST" class="login-form"> 
        <label for="email">E-mail:</label>
        <input type="email" name="email" id="email" required />

        <label for="senha">Senha:</label>
        <input type="password" name="senha" id="senha" required />

        <button type="submit">Entrar</button>
      </form>
    </div>
  </section>
</body>
</html>