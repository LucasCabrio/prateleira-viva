# Prateleira Viva
Trabalho de Dispositivos Móveis. O aplicativo foi feito em React Native com Expo e permite cadastrar lotes de produtos, consultar suas validades e identificar quais estão perto de vencer. O backend usa Node.js e SQLite.

**Lucas Cabrio - 04723-133**
**Paulo Esteves - 04723-090**

## Ideia do projeto
O cenário escolhido foi um pequeno mercado, chamado Mercado do Bairro no cadastro de demonstração. Ele é fictício. O problema tratado é o acompanhamento de validade: dois lotes do mesmo produto podem vencer em dias diferentes e precisam ser conferidos separadamente.

O funcionário cadastra os lotes e consulta uma lista ordenada por vencimento. O app também sugere descontos para os que estão próximos da validade. A intenção é ajudar a vender esses produtos antes do vencimento e evitar descarte. O projeto ainda não foi usado em um mercado real.

## Executar
Requer **Node.js 24 LTS** (o backend utiliza `node:sqlite`) e npm.

Na raiz:
```sh
npm --prefix mobile ci
npm run seed
npm run backend
```
Em outro terminal, na raiz:
```sh
npm run web
```
Abra o endereço exibido pelo Expo. O backend padrão roda na porta 3001.

Conta demonstrativa: **demo@prateleiraviva.com** / **Demo@12345**. Também é possível criar uma conta, inicialmente vazia. O seed só cria dados na primeira execução e nunca apaga registros existentes. As validades são relativas ao dia em que o seed é executado; com o passar dos dias os indicadores mudam.

### Celular físico
1. Computador e celular devem estar na mesma rede.
2. Copie `mobile/.env.example` para `mobile/.env`.
3. Troque o IP de exemplo pelo IPv4 do computador (comando `ipconfig`): `EXPO_PUBLIC_API_URL=http://SEU_IP:3001`.
4. Mantenha o BFF executando e permita a porta 3001 na rede privada, se necessário.
5. Em `mobile`, execute `npx expo start --go` e abra com uma versão de Expo Go compatível com SDK 58. Se o Expo Go instalado não suportar este SDK, use um development build.
6. Development build: `npx eas-cli@latest login`, `npx eas-cli@latest build:configure`, `npx eas-cli@latest build --profile development --platform android`; instale o build e execute `npx expo start --dev-client`. Isso exige conta Expo e acesso à internet.
7. Alternativa Android com SDK/Android Studio instalado: `npx expo run:android`.

No emulador Android, o padrão é `http://10.0.2.2:3001`. No navegador e simulador iOS, `http://localhost:3001`. Reinicie o Expo após mudar variáveis de ambiente. O QR code não inicia nem publica o backend. O projeto não inclui APK assinado nem backend hospedado.

## Funcionalidades e regras
- Cadastro de usuário, login, logout, expiração em 24h e rotas protegidas.
- Dashboard: lotes cadastrados, unidades, lotes vencidos, lotes urgentes e valor em risco.
- CRUD de lotes, busca por nome e filtros por validade.
- Consulta por código de barras digitado via Open Food Facts; preenchimento manual continua disponível se a API falhar.
- Vencido: retirar da venda, sem sugestão de desconto.
- De 0 a 2 dias: sugestão de 30%; de 3 a 7 dias: 15%; acima de 7 dias: sem desconto.
- Valor em risco = soma de quantidade × preço dos lotes que vencem entre hoje e 7 dias. É valor de venda exposto ao risco, não prejuízo contabilizado nem economia comprovada.
- Datas de negócio seguem America/Sao_Paulo. Validade é armazenada como AAAA-MM-DD e exibida como DD/MM/AAAA.
- Um registro representa um lote; o mesmo produto pode ter lotes com validades distintas.
- Cada usuário tem seus próprios lotes. Compartilhamento entre funcionários de uma mesma loja está fora do escopo.
- O desconto é apenas orientação; o sistema não registra vendas nem aplica promoção em caixa.

## Arquitetura
Os arquivos de código têm no máximo 50 linhas. Para conferir, execute `npm run check:lines`. O limite conta também linhas em branco e comentários; não se aplica a documentação, imagens, PDF ou arquivos gerados como `package-lock.json`.

As telas montam os componentes; os hooks em `mobile/src/hooks` cuidam dos formulários. No backend, `server/src/app.js` recebe as requisições e encaminha para `server/src/routes`. A validação dos lotes fica em `validation.js`, separada dos cálculos de `rules.js`.

```text
App React Native / Expo Router
        | HTTP JSON + Bearer token
        v
BFF Node.js
  | autenticação, validação e regras
  +--> SQLite (server/data.db)
  +--> Open Food Facts (HTTPS)
```
O app nunca acessa o banco diretamente. O BFF transforma os dados em indicadores e retorna os campos que a interface precisa.

- `mobile/src/app`: rotas Expo Router e bloqueio de acesso.
- `mobile/src/screens`: telas de login, dashboard, consulta e formulário.
- `mobile/src/components`: Button, Field, Message, Page e BatchCard reutilizáveis.
- `mobile/src/contexts`: sessão e estado dos lotes.
- `mobile/src/services/api.ts`: conexão HTTP, timeout e tratamento de sessão.
- `server/src/app.js` e `server/src/routes`: entrada HTTP e operações do BFF.
- `server/src/auth.js`: hashes de senha e sessões.
- `server/src/rules.js` e `server/src/validation.js`: cálculos e validação.
- `server/src/database.js`: schema e conexão SQLite.
- `server/src/seed.js`: demonstração reproduzível.
- `server/test`: testes de regras, API e persistência.
- `docs/screenshots`: capturas reais do app Expo web em viewport de celular.
- `docs/roteiro-apresentacao.md`: sequência de demonstração e assuntos para revisar.
- `output/pdf`: relatório final com os integrantes.

### Banco
`users(id, name, email UNIQUE, password)`
`sessions(token PK, user_id FK, expires)`
`batches(id, user_id FK, name, barcode, quantity, price, expires, category, created_at)`

A senha é armazenada com scrypt e salt aleatório. Tokens opacos têm 32 bytes aleatórios, apenas seu SHA-256 é salvo no banco. SQL usa parâmetros e as consultas de lotes verificam o proprietário. No mobile, token fica no SecureStore; na web, sessionStorage. Login tem limite de tentativas por IP. O banco e arquivos .env são ignorados pelo Git.

### API
| Método | Rota | Finalidade |
|---|---|---|
| POST | /auth/register | Criar conta e sessão |
| POST | /auth/login | Autenticar |
| GET | /auth/me | Restaurar sessão |
| POST | /auth/logout | Revogar sessão |
| GET | /dashboard | Indicadores do usuário |
| GET | /batches | Consultar lotes |
| POST | /batches | Cadastrar lote |
| PUT | /batches/:id | Editar lote |
| DELETE | /batches/:id | Excluir lote |
| GET | /products/lookup?barcode=... | Consultar catálogo externo |
| GET | /health | Verificar servidor |

As rotas de negócio exigem `Authorization: Bearer TOKEN`. Erros retornam `{message}` com status 400, 401, 404, 409, 429 ou 502 conforme o caso.

## Verificação
```sh
npm test
npm run check:lines
cd mobile
npx tsc --noEmit
npx eslint .
npx expo-doctor
npx expo export --platform all
```
Verificados em 27/10/2026: testes de backend; tipos; lint direto; 20 verificações Expo Doctor; bundles Android/iOS/web; fluxo web automatizado de login, cadastro, consulta, edição, exclusão, logout e proteção de rota. API externa real consultada com 3017620422003 e retornou Nutella. Os testes automatizados de integração externa usam respostas controladas para testar também 404 e indisponibilidade.

**Limites da validação:** não executado em aparelho Android/iOS físico, não gerado APK/IPA. Exportação de bundles não substitui teste nativo. `expo lint` apresentou erro de detecção da versão ESLint; o mesmo código passou usando `npx eslint .`.

**Dependências:** npm audit reportou 3 alertas high na cadeia de desenvolvimento Expo CLI → Zod 3. A correção automática sugerida faz downgrade incompatível do Expo; não foi aplicada. Reavaliar versões antes de produção. O BFF usa somente módulos nativos do Node.

## Escopo acadêmico
HTTP e CORS amplo facilitam a demonstração local. Para produção: HTTPS, origem restrita, controle de acesso por loja, backup, monitoramento e revisão de dependências. Sem sincronização offline, notificações, leitor por câmera ou registro de vendas. Dados demo são fictícios. Não há conexão direta do app com SQLite.

## Referências
- [Expo SDK 58](https://docs.expo.dev/versions/v58.0.0/)
- [Expo Router](https://docs.expo.dev/router/installation/)
- [SecureStore](https://docs.expo.dev/versions/v58.0.0/sdk/securestore/)
- [Open Food Facts API](https://openfoodfacts.github.io/openfoodfacts-server/api/)
- [Node.js SQLite](https://nodejs.org/api/sqlite.html)

Dados consultados do Open Food Facts são colaborativos e podem estar incompletos. A interface identifica a origem. Consulte as condições ODbL do catálogo ao redistribuir dados.
