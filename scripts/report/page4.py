from .settings import (
    Spacer, Table, TableStyle, colors, story, sub
)
from .layout import p, section

def build():
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
