from .settings import (
    caption, sub
)
from .layout import p, section

def build():
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
