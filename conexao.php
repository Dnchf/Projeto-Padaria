<?php
$host = "localhost";
$user = "root"; // Por padrão, o XAMPP usa "root" como usuário
$password = ""; // Por padrão, o XAMPP não tem senha
$dbname = "clientes"; // Use o nome do seu banco de dados aqui

// Conexão com o banco de dados
$conexao = mysqli_connect($host, $user, $password, $dbname);

// Verifica se houve erro na conexão
if (!$conexao) {
    die("Falha na conexão com o banco de dados: " . mysqli_connect_error());
}

// Opcional: exibe uma mensagem de sucesso
// echo "Conectado ao banco de dados com sucesso!";
?>
