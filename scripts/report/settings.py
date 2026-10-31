"""Gera o relatório do trabalho a partir dos prints em docs/screenshots."""
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Image, Table, TableStyle
)

ROOT = Path(__file__).resolve().parents[2]
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
