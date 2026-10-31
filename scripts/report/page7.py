from .layout import p, screenshots, section

def build():
    section("4. Telas do aplicativo (continuação)")
    screenshots("05-cadastro.png", "06-exclusao.png",
                "<b>Figura 5 - Cadastro.</b> Preenchimento dos dados de um novo lote.",
                "<b>Figura 6 - Exclusão.</b> Confirmação antes de remover o registro.")
    p("O formulário de cadastro e edição é o mesmo componente. Na edição, os campos "
      "começam preenchidos. Após salvar ou excluir, o app atualiza a lista e mostra "
      "uma mensagem com o resultado.")
