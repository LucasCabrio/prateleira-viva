# Apresentação do Prateleira Viva

Lucas Cabrio - 04723-133

Paulo Esteves - 04723-090

## Sequência da demonstração

1. Apresentar o problema: acompanhar as validades dos lotes de um pequeno mercado.
2. Entrar com a conta demo e mostrar o resumo. Explicar como o valor em risco é calculado.
3. Abrir a lista de lotes e filtrar os que vencem em até sete dias.
4. Cadastrar um lote. O código 3017620422003 pode ser usado para mostrar a consulta ao Open Food Facts.
5. Alterar a quantidade, salvar e conferir a mudança na lista.
6. Reiniciar o backend e consultar o registro novamente para demonstrar a persistência.
7. Excluir o lote com confirmação e sair da conta.

## Código para mostrar

- `mobile/src/components/BatchCard.tsx`: o mesmo cartão é usado no resumo e na consulta.
- `mobile/src/screens/BatchFormScreen.tsx`: o formulário atende tanto ao cadastro quanto à edição.
- `mobile/src/services/api.ts`: requisições do app para o backend.
- `server/src/rules.js`: cálculo dos dias restantes, desconto e indicadores.
- `server/src/database.js`: tabelas do SQLite.
- `server/src/auth.js`: senha e sessão do usuário.

## Assuntos para revisar antes

Saber explicar a diferença entre produto e lote; por que o app passa pelo BFF antes de chegar ao banco; onde os dados ficam salvos; como o token identifica o usuário; e o que acontece quando a consulta externa falha.

Os percentuais de 15% e 30% são regras escolhidas para a demonstração. Não vieram de uma pesquisa com mercados e não alteram o preço de venda automaticamente.

## Preparação

Conferir o IP da API, a conexão do celular e as datas dos lotes. O seed mantém os dados existentes, então os produtos envelhecem conforme os dias passam. Se o catálogo externo não responder, o formulário permite digitar o nome manualmente.

Combinar entre os integrantes quem apresenta cada parte e ensaiar a sequência no aparelho que será usado na aula.
