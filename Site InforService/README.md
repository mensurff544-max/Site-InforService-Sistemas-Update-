# Site InforService

Projeto convertido para site est�tico puro.

## Estrutura

- index.html: p�gina inicial
- services.html: p�gina de servi�os
- contact.html: p�gina de contato
- admin-analytics.html: painel est�tico com dados locais
- 404.html e 500.html: p�ginas de erro
- assets/css/style.css: estilos globais
- assets/js/site.js: comportamentos globais
- assets/js/home.js: intera��es da home
- assets/js/contact.js: l�gica do formul�rio de contato
- assets/js/analytics.js: renderiza��o do painel de analytics
- assets/data/analytics.json: dados simulados locais
- assets/img/favicon.svg: favicon
- robots.txt: instru��es para rob�s
- sitemap.xml: sitemap do site
- .htaccess: regras Apache para URLs sem .html e headers

## Publica��o

1. Envie todos os arquivos para a raiz p�blica da hospedagem.
2. Garanta que o servidor Apache esteja lendo o arquivo .htaccess.
3. Acesse /, /services e /contact para validar as URLs amig�veis.
4. O formul�rio de contato abre uma conversa no WhatsApp com a mensagem preenchida.
5. O painel admin-analytics carrega dados do arquivo assets/data/analytics.json.

## Observa��es

- N�o h� backend, Flask ou Python.
- Se quiser atualizar os n�meros do painel, edite assets/data/analytics.json.
- O fetch do analytics funciona normalmente em hospedagem HTTP/HTTPS.

