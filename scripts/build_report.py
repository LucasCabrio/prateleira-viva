"""Gera o PDF usando as seções em scripts/report."""
from report.settings import DEST, story, SimpleDocTemplate
from report.layout import footer, newpage
from report.page1 import build as page1
from report.page2 import build as page2
from report.page3 import build as page3
from report.page4 import build as page4
from report.page5 import build as page5
from report.page6 import build as page6
from report.page7 import build as page7
from report.page8 import build as page8

pages = [page1, page2, page3, page4, page5, page6, page7, page8]
for index, page in enumerate(pages):
    if index:
        newpage()
    page()

doc = SimpleDocTemplate(str(DEST), pagesize=(595.28, 841.89),
                        rightMargin=57, leftMargin=57, topMargin=57, bottomMargin=57,
                        title="Prateleira Viva - Relatório do projeto",
                        author="Lucas Cabrio - 04723-133; Paulo Esteves - 04723-090")
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(DEST)
