from .settings import (
    Image, PageBreak, Paragraph, ROOT, Table, TableStyle, body, caption, colors, story, title
)

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
