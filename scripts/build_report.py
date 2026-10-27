"""Gera o relatório do trabalho a partir dos prints em docs/screenshots."""
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Image, Table, TableStyle
)

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "output/pdf/Prateleira_Viva_Lucas_Cabrio_Paulo_Esteves.pdf"
DEST.parent.mkdir(parents=True, exist_ok=True)

body = ParagraphStyle("body", fontName="Helvetica", fontSize=11, leading=17,
                      spaceAfter=12, alignment=TA_JUSTIFY)
title = ParagraphStyle("title", parent=body, fontName="Helvetica-Bold",
                       fontSize=17, leading=22, spaceAfter=20, alignment=0)
sub = ParagraphStyle("sub", parent=body, fontName="Helvetica-Bold",
                     fontSize=12, leading=18, spaceBefore=8, alignment=0)
caption = ParagraphStyle("caption", parent=body, fontSize=9, leading=13,
                         alignment=0, spaceAfter=10)
center = ParagraphStyle("center", parent=body, alignment=TA_CENTER, leading=20)
story = []

def p(text, style=body):
    story.append(Paragraph(text, style))

def section(text):
    p(text, title)

def newpage():
    story.append(PageBreak())

def screenshots(a, b, ca, cb):
    def image(name):
        return Image(str(ROOT / "docs/screenshots" / name), width=210, height=455.16)
    table = Table([[image(a), image(b)],
                   [Paragraph(ca, caption), Paragraph(cb, caption)]],
                  colWidths=[240, 240])
    table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ALIGN", (0, 0), (-1, 0), "CENTER"),
        ("TOPPADDING", (0, 1), (-1, 1), 12),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ]))
    story.append(table)

def footer(canvas, doc):
    if doc.page > 1:
        canvas.setFont("Helvetica", 9)
        canvas.setFillColor(colors.HexColor("#666666"))
        canvas.drawString(57, 31, "Prateleira Viva - Dispositivos Móveis")
        canvas.drawRightString(538, 31, str(doc.page))

story.append(Spacer(1, 45))
p("TRABALHO DE DISPOSITIVOS MÓVEIS", center)
story.append(Spacer(1, 100))
p("<b>PRATELEIRA VIVA</b>", ParagraphStyle(
    "cover", parent=center, fontSize=22, leading=30))
p("Aplicativo para controle de validade de produtos", center)
story.append(Spacer(1, 85))
p("Lucas Cabrio - 04723-133<br/>Paulo Esteves - 04723-090", center)
story.append(Spacer(1, 80))
p("Relatório do projeto desenvolvido em React Native com Expo,<br/>"
  "backend Node.js e banco de dados SQLite.", center)
story.append(Spacer(1, 65))
p("Outubro de 2026", center)
newpage()

section("1. Problema e proposta")
p("O projeto trata do controle de validade em um pequeno mercado. Nesse tipo de "
  "negócio, o mesmo produto pode chegar em entregas diferentes e ter datas de "
  "vencimento distintas. Conferir apenas o nome do produto não é suficiente: "
  "é necessário acompanhar cada lote.")
p("Foi usado como exemplo o Mercado do Bairro, uma empresa fictícia. O aplicativo "
  "é voltado ao responsável pelo estoque, que cadastra os lotes e consulta quais "
  "precisam ser vendidos primeiro. A intenção é diminuir os esquecimentos e o "
  "descarte de produtos. Ainda não houve uso em uma empresa real.")
p("1.1 Funcionamento", sub)
p("Após entrar na conta, o usuário vê um resumo dos lotes, a quantidade de unidades "
  "e os produtos próximos do vencimento. Na consulta, pode buscar pelo nome ou "
  "filtrar os lotes que vencem em até sete dias. O cadastro pede nome, quantidade, "
  "preço unitário, validade e categoria.")
p("Cada registro representa um lote. Por exemplo, duas caixas de leite com validades "
  "diferentes devem ser cadastradas separadamente. Os dados podem ser editados e a "
  "exclusão pede confirmação.")
p("1.2 Regras escolhidas", sub)
rows = [["Prazo de validade", "Orientação no aplicativo"],
        ["Já venceu", "Retirar da venda; sem desconto"],
        ["Hoje ou nos próximos 2 dias", "Sugerir 30% de desconto"],
        ["Entre 3 e 7 dias", "Sugerir 15% de desconto"],
        ["Mais de 7 dias", "Acompanhar, sem desconto"]]
table = Table(rows, colWidths=[210, 270], hAlign="LEFT")
table.setStyle(TableStyle([
    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ("FONTSIZE", (0, 0), (-1, -1), 10),
    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#eeeeee")),
    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#bbbbbb")),
    ("TOPPADDING", (0, 0), (-1, -1), 9),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
]))
story.extend([table, Spacer(1, 16)])
p("Os percentuais foram definidos para a demonstração do projeto. São sugestões "
  "e não alteram automaticamente o preço em um sistema de vendas.")
p("O indicador <b>valor em risco</b> soma quantidade × preço dos lotes que vencem "
  "entre hoje e sete dias. Um lote com 10 unidades de R$ 5,00 contribui com R$ 50,00 "
  "para o indicador. Esse valor não representa prejuízo já ocorrido.")
newpage()

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
  "<b>mobile/src/contexts:</b> sessão e dados usados pelas telas.<br/>"
  "<b>mobile/src/services/api.ts:</b> requisições para o backend.")
p("O cartão <b>BatchCard</b> aparece no resumo e na consulta. O "
  "<b>BatchFormScreen</b> serve para cadastrar e editar. Assim, uma alteração "
  "no formulário não precisa ser repetida em duas telas.")
p("<b>server/src/app.js:</b> rotas da API.<br/>"
  "<b>auth.js:</b> senhas e sessões.<br/>"
  "<b>rules.js:</b> validação e regras de validade.<br/>"
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
newpage()

section("3. Integração externa e validações")
p("O Open Food Facts é usado para buscar o nome de um alimento pelo código de "
  "barras. O código é digitado no formulário e enviado ao BFF, que consulta "
  "<b>/api/v2/product/{codigo}.json</b>. Não foi implementada leitura pela câmera.")
p("Quando encontra o produto, o app preenche o nome. Quantidade, preço e validade "
  "continuam sendo informados pelo usuário, pois são dados específicos daquele "
  "lote. Na verificação realizada, o código 3017620422003 retornou Nutella.")
p("Se o catálogo não responder ou não tiver o produto, aparece uma mensagem e o "
  "cadastro manual continua disponível. O nome retornado deve ser conferido, "
  "pois o catálogo é colaborativo.")
p("3.1 Rotas do BFF", sub)
routes = [
    ("POST /auth/register", "Cadastro de conta"),
    ("POST /auth/login", "Login"),
    ("GET /auth/me", "Consulta da sessão"),
    ("POST /auth/logout", "Encerramento da sessão"),
    ("GET /dashboard", "Indicadores"),
    ("GET e POST /batches", "Consulta e cadastro de lotes"),
    ("PUT e DELETE /batches/:id", "Edição e exclusão"),
    ("GET /products/lookup", "Consulta ao Open Food Facts"),
]
table = Table([["Rota", "Uso"]] + routes, colWidths=[245, 235])
table.setStyle(TableStyle([
    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ("FONTSIZE", (0, 0), (-1, -1), 10),
    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#eeeeee")),
    ("LINEBELOW", (0, 0), (-1, -1), 0.4, colors.HexColor("#bbbbbb")),
    ("TOPPADDING", (0, 0), (-1, -1), 8),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
]))
story.extend([table, Spacer(1, 16)])
p("3.2 Tratamento de erros", sub)
p("O formulário verifica campos obrigatórios, quantidade, preço e formato da "
  "validade. O backend repete a validação e também rejeita datas inexistentes. "
  "Por exemplo, 30/02/2026 não é aceito, mesmo tendo o formato esperado.")
p("A edição e a exclusão conferem se o lote pertence ao usuário autenticado. "
  "O acesso ao banco usa consultas com parâmetros. Mensagens de erro são "
  "mostradas na tela quando a sessão expira, a rede falha ou os dados estão incorretos.")
newpage()

section("4. Telas do aplicativo")
p("As figuras foram capturadas na versão web do aplicativo Expo, em uma janela "
  "de 430 × 932 pixels. Os registros exibidos são dados de demonstração.", caption)
screenshots("01-login.png", "02-dashboard.png",
            "<b>Figura 1 - Login.</b> Entrada por e-mail e senha, com opção de criar conta.",
            "<b>Figura 2 - Resumo.</b> Valor dos lotes próximos da validade, quantidade e lista por vencimento.")
newpage()

section("4. Telas do aplicativo (continuação)")
screenshots("03-prateleira.png", "04-edicao.png",
            "<b>Figura 3 - Consulta.</b> Busca por produto e filtros de validade.",
            "<b>Figura 4 - Edição.</b> Dados do lote e sugestão de desconto calculada pelo backend.")
p("O lote de iogurte mostrado na edição está perto do vencimento. Por isso, "
  "recebe a sugestão de 30%. O produto vencido na consulta é sinalizado para "
  "retirada da venda, sem sugestão de desconto.")
newpage()

section("4. Telas do aplicativo (continuação)")
screenshots("05-cadastro.png", "06-exclusao.png",
            "<b>Figura 5 - Cadastro.</b> Preenchimento dos dados de um novo lote.",
            "<b>Figura 6 - Exclusão.</b> Confirmação antes de remover o registro.")
p("O formulário de cadastro e edição é o mesmo componente. Na edição, os campos "
  "começam preenchidos. Após salvar ou excluir, o app atualiza a lista e mostra "
  "uma mensagem com o resultado.")
newpage()

section("5. Execução e testes")
p("É necessário ter Node.js 24 LTS e npm. Na pasta do projeto, executar:")
p("<font face='Courier' size='10'>npm --prefix mobile ci<br/>"
  "npm run seed<br/>npm run backend</font>")
p("Em outro terminal: <font face='Courier' size='10'>npm run web</font>. "
  "A conta de demonstração é <b>demo@prateleiraviva.com</b>, com senha "
  "<b>Demo@12345</b>. O seed não sobrescreve dados existentes.")
p("No celular, EXPO_PUBLIC_API_URL deve apontar para o IP do computador, na "
  "porta 3001. Os dois precisam estar na mesma rede. O README traz a configuração "
  "para Expo Go compatível e para development build.")
p("5.1 Verificações realizadas", sub)
p("Os testes do backend cobrem cadastro, login, dados inválidos, CRUD, separação "
  "dos registros por usuário, expiração e logout. Também verificam a leitura "
  "dos dados depois de fechar e reabrir o banco. A consulta externa foi testada "
  "com respostas controladas de sucesso e erro, além de uma chamada real.")
p("O fluxo de interface foi executado no navegador: login, cadastro, consulta, "
  "edição, exclusão e logout. TypeScript e ESLint passaram. O Expo Doctor "
  "aprovou 20 verificações e foram gerados bundles Android, iOS e web. "
  "Ainda falta testar em aparelhos físicos; não foi gerado APK ou IPA.")
p("5.2 Limitações", sub)
p("Cada usuário tem seus próprios lotes; não há compartilhamento por loja. "
  "Também não há registro de vendas, notificações ou funcionamento offline. "
  "A aplicação usa HTTP local para a apresentação. Um uso real exigiria "
  "hospedagem com HTTPS, backup e ajustes de acesso.")
p("A verificação de dependências apontou três alertas de segurança na cadeia "
  "Expo CLI/Zod. A correção automática sugeria reduzir a versão do Expo e "
  "não foi aplicada. O detalhe está registrado no README.")
p("Referências", sub)
p("Expo: https://docs.expo.dev/versions/v58.0.0/<br/>"
  "Expo Router: https://docs.expo.dev/router/installation/<br/>"
  "Open Food Facts: https://openfoodfacts.github.io/openfoodfacts-server/api/<br/>"
  "SQLite no Node.js: https://nodejs.org/api/sqlite.html", caption)

doc = SimpleDocTemplate(str(DEST), pagesize=(595.28, 841.89),
                        rightMargin=57, leftMargin=57, topMargin=57, bottomMargin=57,
                        title="Prateleira Viva - Relatório do projeto",
                        author="Lucas Cabrio - 04723-133; Paulo Esteves - 04723-090")
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(DEST)
