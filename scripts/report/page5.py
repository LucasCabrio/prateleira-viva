from .settings import (
    caption
)
from .layout import p, screenshots, section

def build():
    section("4. Telas do aplicativo")
    p("As figuras foram capturadas na versão web do aplicativo Expo, em uma janela "
      "de 430 × 932 pixels. Os registros exibidos são dados de demonstração.", caption)
    screenshots("01-login.png", "02-dashboard.png",
                "<b>Figura 1 - Login.</b> Entrada por e-mail e senha, com opção de criar conta.",
                "<b>Figura 2 - Resumo.</b> Valor dos lotes próximos da validade, quantidade e lista por vencimento.")
