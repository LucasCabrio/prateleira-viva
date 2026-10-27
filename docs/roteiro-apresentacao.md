# Roteiro de apresentação - 8 a 10 minutos
Lucas Cabrio - 04723-133
Paulo Esteves - 04723-090

## 1. Problema e propósito (Lucas, 1 min)
"Escolhemos um pequeno mercado fictício. O problema é esquecer produtos próximos do vencimento. A solução organiza lotes por validade e mostra onde agir primeiro. Esperamos reduzir desperdícios, mas não medimos resultados em uma empresa real."

## 2. Demonstração (Lucas, 3 min)
1. Iniciar o backend e Expo; entrar com a conta demo.
2. Explicar valor em risco, unidades e vencidos. Valor em risco não significa lucro perdido.
3. Abrir Prateleira, buscar Iogurte e mostrar a sugestão de desconto.
4. Cadastrar lote, digitar 3017620422003 e buscar no Open Food Facts.
5. Confirmar o nome retornado e preencher quantidade, preço e validade.
6. Salvar e localizar o lote na consulta.

## 3. CRUD, regras e persistência (Paulo, 2 min)
1. Editar a quantidade do lote e salvar.
2. Recarregar o app para mostrar que o cadastro permanece.
3. Reiniciar o backend e consultar novamente: o arquivo SQLite mantém os dados.
4. Excluir com confirmação.
5. Mostrar campo inválido e mensagem de erro.
6. Sair e explicar que as rotas exigem autenticação.

## 4. Arquitetura (Paulo, 2 min)
"A interface usa React Native e Expo. Rotas ficam em app, telas em screens e componentes reutilizáveis em components. O serviço api.ts centraliza as requisições. O backend é um BFF porque atende ao app e prepara indicadores e sugestões. Só ele acessa o SQLite e o Open Food Facts."
Mostrar rules.js, auth.js e database.js.

## Perguntas prováveis
- **Por que SQLite?** Banco relacional persistente, simples de executar e suficiente para um protótipo local.
- **Por que BFF?** Centraliza validação, autenticação, acesso externo e dados prontos para a interface.
- **Onde fica a senha?** No backend como hash scrypt com salt; nunca em texto puro no banco.
- **Como protege os dados?** Token de sessão e filtro user_id em cada operação.
- **E se a API externa cair?** Timeout e mensagem; cadastro manual permanece disponível.
- **Qual a regra de desconto?** 30% até 2 dias, 15% entre 3 e 7, zero depois; vencidos não recebem sugestão.
- **Por que produto e lote?** O mesmo produto pode ter diferentes validades; cada cadastro é um lote.
- **O que falta para empresa real?** Acesso compartilhado por loja, HTTPS, backup, revisão de dependências e teste em celulares reais.

## Antes da aula
Executar seed apenas para preparar a conta. Conferir datas, Wi-Fi e IP da API. Testar o aparelho antes da apresentação. Ter a versão web e o PDF como apoio. Se a API externa estiver fora do ar, explicar o fallback e usar cadastro manual, sem afirmar que uma resposta simulada veio da internet.
