from .settings import (
    sub
)
from .layout import p, section

def build():
    section("2. Arquitetura e organização do código")
    p("O projeto tem um aplicativo e um backend separados. O aplicativo usa React "
      "Native com Expo e se comunica com o backend por requisições HTTP em JSON. "
      "O backend funciona como BFF: atende às telas e calcula as informações que "
      "elas precisam. Apenas ele acessa o banco e a API externa.")
    p("<b>Aplicativo Expo → BFF Node.js → SQLite</b><br/>"
      "O BFF também consulta o Open Food Facts pela internet.", sub)
    p("O SQLite foi escolhido porque salva os dados em um arquivo e não exige instalar "
      "um servidor de banco separado. O arquivo fica em <b>server/data.db</b>. "
      "Reiniciar o backend não apaga os cadastros.")
    p("2.1 Separação dos arquivos", sub)
    p("<b>mobile/src/app:</b> rotas e verificação de acesso.<br/>"
      "<b>mobile/src/screens:</b> telas de login, resumo, consulta e formulário.<br/>"
      "<b>mobile/src/components:</b> campos, botões, mensagens e cartões de lote.<br/>"
      "<b>mobile/src/hooks:</b> estado e ações dos formulários.<br/>"
      "<b>mobile/src/contexts:</b> sessão e dados usados pelas telas.<br/>"
      "<b>mobile/src/services/api.ts:</b> requisições para o backend.")
    p("O cartão <b>BatchCard</b> aparece no resumo e na consulta. O "
      "<b>BatchFormScreen</b> serve para cadastrar e editar. Assim, uma alteração "
      "no formulário não precisa ser repetida em duas telas. Os arquivos de código têm até 50 linhas.")
    p("<b>server/src/app.js e routes/:</b> entrada HTTP e operações da API.<br/>"
      "<b>auth.js:</b> senhas e sessões.<br/>"
      "<b>rules.js e validation.js:</b> cálculos e validação dos lotes.<br/>"
      "<b>database.js:</b> conexão e criação das tabelas.<br/>"
      "<b>seed.js:</b> conta e lotes de demonstração.")
    p("2.2 Banco e autenticação", sub)
    p("A tabela <b>users</b> guarda nome, e-mail e senha protegida por hash. "
      "<b>sessions</b> relaciona o token ao usuário e ao prazo de expiração. "
      "<b>batches</b> guarda os lotes e o identificador do proprietário.")
    p("O login gera uma sessão válida por 24 horas. As rotas verificam o token e "
      "filtram os registros pelo usuário. A senha usa scrypt com salt; o banco guarda "
      "somente o hash do token de sessão. No celular, o token fica no SecureStore. "
      "Na versão web, fica no sessionStorage.")
