from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from pathlib import Path
from xml.sax.saxutils import escape

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output/pdf'
OUT.mkdir(parents=True,exist_ok=True)
path=OUT/'Prateleira_Viva_Lucas_Cabrio_Paulo_Esteves.pdf'
c=canvas.Canvas(str(path),pagesize=(595.28,841.89))
c.setTitle('Prateleira Viva - Lucas Cabrio e Paulo Esteves')
c.setAuthor('Lucas Cabrio - 04723-133; Paulo Esteves - 04723-090')
green='#26694E'; ink='#173F35'; muted='#66766B'; cream='#F5F3EB'; lime='#DFEDB1'
style=ParagraphStyle('body',fontName='Helvetica',fontSize=11,leading=17,textColor=HexColor(ink))
page=0
def text(s,x,y,size=11,color=ink,bold=False):
 c.setFillColor(HexColor(color));c.setFont('Helvetica-Bold' if bold else 'Helvetica',size);c.drawString(x,y,s)
def para(s,x,y,w=499,size=11):
 st=ParagraphStyle('p',parent=style,fontSize=size,leading=size*1.5)
 p=Paragraph(s,st);_,h=p.wrap(w,700);p.drawOn(c,x,y-h);return y-h-14
def start(kicker,title):
 global page
 page+=1;c.setFillColor(HexColor(cream));c.rect(0,0,596,842,fill=1,stroke=0)
 text('PRATELEIRA VIVA',48,793,10,green,True);text(kicker.upper(),48,744,10,muted,True)
 text(title,48,710,28,ink,True)
 c.setStrokeColor(HexColor('#D9DED3'));c.line(48,49,547,49)
 text('Lucas Cabrio | Paulo Esteves',48,31,9,muted);text(f'{page:02}',525,31,9,muted)
def end():c.showPage()
def heading(s,y):text(s,48,y,15,green,True);return y-18
def shot(filename,x,y,w=221):
 img=ImageReader(str(ROOT/'docs/screenshots'/filename));iw,ih=img.getSize();h=w*ih/iw
 c.drawImage(img,x,y-h,w,h,mask='auto');return y-h
start('Projeto de dispositivos móveis','Menos perdas. Mais futuro.')
para('Uma aplicação mobile para dar visibilidade aos produtos próximos do vencimento em pequenos mercados.',48,670,450,16)
c.setFillColor(HexColor(green));c.roundRect(48,340,499,205,24,fill=1,stroke=0)
text('pv',72,465,54,lime,True);text('Validade vira prioridade.',72,418,23,'#FFFFFF',True)
text('React Native + Expo  |  BFF Node.js  |  SQLite',72,380,12,'#FFFFFF')
text('INTEGRANTES',48,287,10,muted,True)
text('Lucas Cabrio - 04723-133',48,257,16,ink,True)
text('Paulo Esteves - 04723-090',48,229,16,ink,True)
para('Projeto acadêmico • 27 de outubro de 2026<br/>Empresa de referência fictícia: Mercado do Bairro.<br/>Código modularizado, persistência real e integração externa.',48,179)
end()
start('01 / Propósito','O problema de negócio')
y=para('Pequenos mercados precisam conferir a validade de vários produtos. Anotações dispersas dificultam identificar quais lotes exigem ação imediata. Isso pode gerar descarte e perda de oportunidades de venda.',48,665)
y=heading('Público e proposta',y-12)
y=para('Dono ou funcionário responsável pela prateleira. O app reúne os lotes em uma lista por validade, exibe indicadores e recomenda descontos para os produtos ainda válidos.',48,y)
y=heading('O diferencial, sem complicar',y-10)
y=para('Uma fila de prioridade com três decisões claras: acompanhar, considerar desconto ou retirar da venda. A consulta por código de barras evita redigitar o nome quando o produto existe no catálogo externo.',48,y)
y=heading('Regras implementadas no BFF',y-10)
for line in ['Vencido: sinalizar retirada; nenhum desconto sugerido.','De hoje até 2 dias: sugestão de 30% de desconto.','De 3 a 7 dias: sugestão de 15% de desconto.','Acima de 7 dias: acompanhar, sem desconto.']:
 y=para('• '+line,48,y)
y=heading('Benefícios esperados',y-6)
y=para('Menos esquecimentos, cadastro mais rápido e decisões mais consistentes. Não houve piloto em empresa real; economia ou redução de perdas ainda não foram mensuradas.',48,y)
para('<b>Valor em risco:</b> quantidade × preço dos lotes com validade entre hoje e 7 dias. É valor potencial de venda, não prejuízo realizado. Produtos vencidos são contabilizados separadamente.',48,y)
end()
start('02 / Arquitetura','Três camadas, um fluxo')
boxes=[(48,562,499,94,'APP • React Native + Expo','Telas, componentes, rotas e estado de sessão'),(48,404,499,94,'BFF • Node.js','Autenticação, validação, indicadores e descontos'),(48,248,238,94,'SQLite','Usuários, sessões e lotes'),(309,248,238,94,'Open Food Facts','Consulta de nome por código')]
for x,y,w,h,title,desc in boxes:
 c.setFillColor(HexColor('#FFFFFF'));c.roundRect(x,y,w,h,15,fill=1,stroke=0);text(title,x+17,y+61,13,green,True);para(desc,x+17,y+43,w-34,10)
text('HTTP JSON + token de sessão',190,530,11,muted)
c.setStrokeColor(HexColor(green));c.line(297,521,297,503);c.line(297,503,293,509);c.line(297,503,301,509)
text('SQL parametrizado',83,370,11,muted);text('HTTPS + timeout',353,370,11,muted)
para('O aplicativo não abre o banco. Toda leitura e gravação passa pelo BFF. O backend também consulta a API externa e devolve somente os campos necessários à interface.',48,214)
para('<b>Por que BFF?</b> Ele não apenas repassa registros: calcula validade, status, desconto e indicadores para este app. SQLite mantém o projeto simples e persiste em server/data.db, mesmo após reiniciar o servidor.',48,140)
end()
start('03 / Organização e dados','Código fácil de explicar')
y=665
for title,body in [
 ('Rotas e telas','mobile/src/app contém as rotas Expo Router e a proteção de acesso. screens contém LoginScreen, DashboardScreen, InventoryScreen e BatchFormScreen.'),
 ('Componentes reutilizáveis','components reúne Button, Field, Message, Page e BatchCard. theme.ts centraliza cores e formatação. Cada componente tem uma responsabilidade visível.'),
 ('Estado e integração','AuthContext gerencia sessão. InventoryContext guarda lotes e indicadores. services/api.ts centraliza fetch, token, timeout e tratamento de erros.'),
 ('Backend separado por responsabilidade','app.js define rotas HTTP; auth.js cuida de senhas e sessões; rules.js valida e calcula; database.js cria o schema; seed.js prepara dados fictícios.')]:
 y=heading(title,y);y=para(body,48,y);y-=4
y=heading('Modelo relacional',y)
y=para('<b>users:</b> id, name, email único, password (hash).<br/><b>sessions:</b> token (hash), user_id, expires.<br/><b>batches:</b> id, user_id, name, barcode, quantity, price, expires, category, created_at.',48,y)
para('Relacionamentos: um usuário possui várias sessões e vários lotes. Cada lote pertence a um usuário. O mesmo produto pode aparecer em lotes distintos, com validades diferentes.',48,y)
end()
start('04 / Autenticação e dashboard','Da entrada à decisão')
shot('01-login.png',48,660)
shot('02-dashboard.png',326,660)
para('<b>1. Acesso:</b> cadastro de conta, validação de campos e login. Senhas usam scrypt com salt; sessão opaca expira em 24 horas.',48,162,221,10)
para('<b>2. Visão geral:</b> valor em risco, unidades, lotes e vencidos. Dados demonstrativos são fictícios e calculados pelo BFF.',326,162,221,10)
text('Capturas reais: Expo web, viewport 430 × 932. Não são prints de aparelho nativo.',48,70,9,muted)
end()
start('05 / Consulta e edição','A prateleira em ordem')
shot('03-prateleira.png',48,660)
shot('04-edicao.png',326,660)
para('<b>3. Consulta:</b> busca por nome, filtro por prazo e ordenação por validade. Cada cartão abre os detalhes do lote.',48,162,221,10)
para('<b>4. Edição:</b> o formulário reaproveitado mostra o status e a sugestão de preço. Mudanças são validadas e persistidas.',326,162,221,10)
text('Capturas reais da mesma aplicação React Native executada no navegador via Expo.',48,70,9,muted)
end()
start('06 / Cadastro e exclusão','Fluxo completo de dados')
shot('05-cadastro.png',48,660)
shot('06-exclusao.png',326,660)
para('<b>5. Cadastro:</b> nome, quantidade, preço, validade e categoria. Código de barras é opcional; consulta via BFF ao Open Food Facts.',48,162,221,10)
para('<b>6. Exclusão:</b> confirmação explícita antes de apagar. A interface informa o resultado e atualiza a consulta.',326,162,221,10)
text('O registro temporário usado no teste foi excluído; a conta demo foi preservada.',48,70,9,muted)
end()
start('07 / API e segurança','Integrações com propósito')
y=heading('Rotas principais',665)
y=para('<b>POST /auth/register e /auth/login:</b> criar conta e autenticar.<br/><b>GET /auth/me; POST /auth/logout:</b> restaurar e revogar sessão.<br/><b>GET /dashboard:</b> indicadores calculados.<br/><b>GET e POST /batches:</b> consulta e cadastro.<br/><b>PUT e DELETE /batches/:id:</b> edição e exclusão.<br/><b>GET /products/lookup?barcode=...:</b> busca externa autenticada.',48,y)
y=heading('Open Food Facts',y-6)
y=para('O BFF faz uma requisição HTTPS para /api/v2/product/{codigo}.json e solicita product_name e brands. O usuário revisa o nome recebido e informa os dados do lote. Teste real: código 3017620422003 retornou Nutella. Não é usado scanner de câmera.',48,y)
y=para('Se não houver produto, retorna 404; em falha ou timeout, 502. A mensagem orienta o preenchimento manual. Os dados são colaborativos e a origem é identificada na tela. Documentação: openfoodfacts.github.io/openfoodfacts-server/api/',48,y)
y=heading('Controle de acesso e validação',y-6)
y=para('Todas as rotas de negócio exigem Bearer token. O banco guarda o hash do token; o cliente nativo usa SecureStore e a versão web usa sessionStorage. Consultas verificam user_id para impedir acesso aos lotes de outra conta. Logout revoga a sessão.',48,y)
para('Validação no cliente melhora a experiência; validação no servidor protege os dados. O backend rejeita quantidade inválida, preço não positivo, data inexistente e categoria desconhecida. SQL parametrizado evita construir consultas com valores digitados.',48,y)
end()
start('08 / Execução e validação','Preparado para demonstrar')
y=heading('Como executar',665)
y=para('Requisito: Node.js 24 LTS.<br/>1. Na raiz: <b>npm --prefix mobile ci</b><br/>2. Preparar demonstração: <b>npm run seed</b><br/>3. Primeiro terminal: <b>npm run backend</b><br/>4. Segundo terminal: <b>npm run web</b><br/>Conta: demo@prateleiraviva.com / Demo@12345',48,y)
y=para('Para celular, configure EXPO_PUBLIC_API_URL com o IP do computador e mantenha ambos na mesma rede. Use Expo Go compatível com SDK 58 ou development build. Instruções completas e perfil EAS estão no README.',48,y)
y=heading('O que foi verificado',y-4)
y=para('Testes HTTP: login, validação, CRUD, isolamento entre contas, expiração, logout, API externa simulada em sucesso/falha e persistência após reabrir o banco. Teste de interface: login até exclusão e bloqueio de rota após logout. Consulta externa real também realizada.',48,y)
y=para('TypeScript e lint direto aprovados. Expo Doctor: 20/20 verificações. Bundles Android, iOS e web gerados. As telas foram testadas no navegador em dimensões de celular; não houve execução em dispositivo nativo nem geração de APK/IPA.',48,y)
y=heading('Limites e próximos passos',y-4)
para('Escopo acadêmico local: sem vendas, notificações, modo offline ou equipe compartilhada. npm audit aponta 3 alertas high na cadeia Expo CLI/Zod; a correção automática sugerida reduz a versão do Expo e não foi aplicada. Antes de produção: revisar dependências, adotar HTTPS, restringir CORS, configurar backup e testar aparelhos.',48,y)
end()
start('09 / Apresentação','O que cada integrante explica')
y=heading('Lucas Cabrio - 04723-133',665)
y=para('Apresentar o problema do mercado, o público e os benefícios esperados. Demonstrar login, indicadores, consulta e cadastro com busca por código de barras. Explicar os componentes reutilizados no frontend.',48,y)
y=heading('Paulo Esteves - 04723-090',y-10)
y=para('Demonstrar edição, persistência ao reiniciar o backend e exclusão. Explicar BFF, banco, autenticação e regras de validade. Mostrar rules.js e database.js como exemplos centrais.',48,y)
y=heading('Perguntas para ensaiar',y-10)
y=para('<b>Por que SQLite?</b> Persistência relacional simples para um protótipo local.<br/><b>Por que BFF?</b> Prepara dados, aplica regras e protege o acesso ao banco.<br/><b>Se a API cair?</b> Mensagem clara e cadastro manual.<br/><b>O desconto é automático?</b> Não, é uma sugestão para decisão do responsável.<br/><b>Como comprovar persistência?</b> Reiniciar o BFF e consultar o mesmo lote.',48,y)
y=heading('Referências e entregáveis',y-10)
y=para('Código-fonte: github.com/LucasCabrio/prateleira-viva (privado).<br/>Guia detalhado: README.md.<br/>Roteiro: docs/roteiro-apresentacao.md.<br/>Prints: docs/screenshots/.',48,y)
para('Expo SDK 58: docs.expo.dev/versions/v58.0.0/<br/>Expo Router: docs.expo.dev/router/installation/<br/>SecureStore: docs.expo.dev/versions/v58.0.0/sdk/securestore/<br/>Open Food Facts: openfoodfacts.github.io/openfoodfacts-server/api/<br/>Node.js SQLite: nodejs.org/api/sqlite.html',48,y,499,10)
end()
c.save()
print(path)
