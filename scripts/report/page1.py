from .settings import (
    ParagraphStyle, Spacer, center, story
)
from .layout import p

def build():
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
