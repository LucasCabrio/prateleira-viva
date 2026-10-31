from .layout import p, screenshots, section

def build():
    section("4. Telas do aplicativo (continuação)")
    screenshots("03-prateleira.png", "04-edicao.png",
                "<b>Figura 3 - Consulta.</b> Busca por produto e filtros de validade.",
                "<b>Figura 4 - Edição.</b> Dados do lote e sugestão de desconto calculada pelo backend.")
    p("O lote de iogurte mostrado na edição está perto do vencimento. Por isso, "
      "recebe a sugestão de 30%. O produto vencido na consulta é sinalizado para "
      "retirada da venda, sem sugestão de desconto.")
