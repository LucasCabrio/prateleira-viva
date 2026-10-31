from .settings import (
    Spacer, Table, TableStyle, colors, story, sub
)
from .layout import p, section

def build():
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
