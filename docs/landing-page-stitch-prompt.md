# Prompt de Landing Page para Stitch

## Base usada
- `iFarm_Escopo_Completo_v3.docx`
- `iFarm_Agent_Guideline_v3.0 (1).pdf`
- tokens visuais encontrados no projeto em `apps/mobile/lib/core/theme/app_colors.dart`, `apps/mobile/lib/core/theme/app_typography.dart` e `apps/mobile/lib/core/theme/app_theme.dart`

## Resumo estratégico
- A iFarm e uma plataforma digital para o agronegocio que conecta fazendeiros compradores a lojistas e fornecedores de insumos, implementos, maquinas e servicos.
- A proposta central do MVP e acelerar cotacao, comparacao de propostas, pagamento e acompanhamento do pedido em um fluxo simples e confiavel.
- A plataforma possui dois publicos prioritarios na landing page: produtor rural que usa o app e lojista/fornecedor que usa o painel web.
- Os diferenciais de medio prazo que fortalecem o posicionamento sao credito rural integrado, IoT com alertas inteligentes, ESG score e mercado de carbono.
- A comunicacao deve transmitir confianca, eficiencia operacional, inteligencia aplicada ao campo, transparencia comercial, seguranca e visao de ecossistema.
- A landing page nao deve parecer generica de SaaS. Ela deve parecer uma plataforma agro-tech premium, clara, moderna e preparada para escalar.

## Direcao visual confirmada no projeto
- Usar a paleta ja cadastrada no Stitch sem redefinir outra paleta.
- Respeitar as fontes ja definidas no Stitch. No codigo, a fonte base usada e `Inter`.
- Direcao criativa da marca: `The Agrarian Editorial` com north star `The Digital Estate` e conceito de `Organic Precision`.
- Cor principal: verde `Fertile Earth` com base em `#005129`.
- Cor de destaque premium: dourado `Golden Harvest` com base em `#795900` e acentos de destaque mais vivos como `#FFC641`.
- Apoio tonal: neutros claros e arejados como `#F7F9FB`, `#F2F4F6`, `#ECEEF0`, `#E0E3E5`.
- Cor de apoio secundaria pontual: vinho/terra `#782C38`.
- Evitar bordas duras e visual quadrado demais. Priorizar tonal layering, profundidade leve, vidro fosco sutil em header/nav e sombras verdes suaves.
- Cards com cantos arredondados, espacamento generoso, leitura limpa, cara de produto confiavel.

## Prompt pronto para uso no Stitch

```text
Crie uma landing page premium, moderna e altamente conversiva para a plataforma iFarm, em portugues do Brasil, com foco em captacao de leads qualificados para dois publicos:

1. Produtores rurais que vao usar o app mobile para abrir cotacoes, comparar propostas, comprar insumos e acessar futuros recursos como credito rural, IoT e ESG.
2. Lojistas, distribuidores e fornecedores do agro que vao usar o painel web para receber cotacoes, enviar propostas, acompanhar performance comercial e vender mais.

Use EXCLUSIVAMENTE a paleta de cores, estilos, componentes e fontes ja definidos no Stitch para a marca iFarm. Nao invente nova paleta. Respeite os tokens ja existentes.

Direcao estetica obrigatoria:
- identidade visual agro-tech premium, editorial e sofisticada, sem parecer template generico de startup
- sensacao de confianca, eficiencia, inteligencia, proximidade com o campo e robustez operacional
- design claro, contemporaneo e mobile-first
- header e navegacao com leve glassmorphism
- profundidade visual por mudanca de tons, nao por excesso de bordas
- cards com cantos arredondados e espacamento generoso
- sombras sutis com tonalidade verde
- visual limpo, mas com personalidade

Tom de voz:
- claro, confiavel, direto e profissional
- linguagem simples para o produtor, sem perder credibilidade para parceiros, lojistas e bancos
- evitar jargoes exagerados, promessas vazias e tom futurista artificial
- transmitir tecnologia que resolve problema real no campo
- comunicar inovacao com pe no chao
- nao usar claims especulativos ou numeros nao comprovados como prova publica

Objetivo principal da landing page:
- maximizar conversao de visitantes em leads
- segmentar claramente os dois perfis de interesse logo no topo
- levar o visitante para um CTA principal de cadastro, lista de espera, demonstracao ou contato comercial
- reforcar confianca suficiente para o usuario deixar seus dados

Estrutura completa da landing page:

1. Header fixo
- logo iFarm
- links de ancora: Como funciona, Para produtores, Para lojistas, Modulos, Credibilidade, FAQ
- CTA primario no header: "Quero conhecer a iFarm"
- CTA secundario discreto: "Sou lojista"

2. Hero section de alta conversao
- criar uma dobra inicial forte com headline clara, subheadline objetiva, prova de valor e dois caminhos de conversao
- headline precisa comunicar a proposta principal da plataforma de forma simples e poderosa
- subheadline deve explicar que a iFarm conecta produtor rural e lojistas em uma plataforma inteligente para cotacao, compra, pagamento e gestao
- mostrar dois CTAs principais lado a lado:
  - "Quero comprar melhor no agro" para produtores
  - "Quero vender pela iFarm" para lojistas
- adicionar um terceiro CTA de menor destaque: "Agendar demonstracao"
- incluir microcopy de confianca abaixo dos CTAs, por exemplo:
  - "Marketplace agro com cotacao inteligente, fluxo digital e expansao para credito rural, IoT e ESG."
- incluir uma area visual hero que represente o ecossistema:
  - app mobile do produtor
  - painel web do lojista
  - fluxo de cotacao, propostas, pagamento e acompanhamento

Copy sugerida para hero:
Headline:
"A plataforma que conecta o agro certo na hora certa."

Subheadline:
"A iFarm une produtores rurais e fornecedores em um fluxo digital de cotacao, comparacao de propostas, pagamento e acompanhamento de pedidos, com evolucao para credito rural, inteligencia de campo e ESG."

3. Barra de credibilidade imediata
- criar uma faixa curta logo abaixo do hero com pilares de confianca
- usar de 4 a 6 itens curtos
- exemplos de mensagens:
  - "Cotacao digital com comparacao clara de propostas"
  - "Fluxo omnichannel com app, WhatsApp e e-mail"
  - "KYC, compliance e trilha operacional"
  - "Base preparada para credito rural e ESG"
  - "Experiencia para produtor e painel para lojista"

4. Secao "Como funciona"
- explicar em 3 ou 4 passos o fluxo principal da plataforma
- manter leitura muito simples
- mostrar a jornada completa:
  - produtor abre cotacao
  - lojistas recebem e enviam propostas
  - produtor compara e escolhe
  - pagamento e acompanhamento acontecem no mesmo fluxo

Copy base:
Titulo:
"Do pedido a decisao, com menos atrito e mais controle."

Descricao:
"A iFarm digitaliza o processo comercial do agro para reduzir tempo, aumentar transparencia e facilitar a conexao entre quem compra e quem vende."

5. Secao segmentada "Para produtores"
- criar bloco proprio com linguagem centrada em beneficio
- reforcar dores e ganhos:
  - parar de depender de cotacao solta no WhatsApp
  - comparar propostas com mais clareza
  - ganhar tempo na reposicao de insumos e compras recorrentes
  - acompanhar pedidos e historico em um so lugar
  - preparar o caminho para credito rural, alertas inteligentes e ESG
- incluir CTA especifico: "Quero entrar como produtor"

Copy base:
Titulo:
"Para o produtor rural: mais controle, mais agilidade, melhores decisoes."

Bullets:
"Abra cotacoes em poucos passos pelo app."
"Compare preco, prazo e condicoes com mais transparencia."
"Acompanhe pedidos, entregas e recorrencia de compra no mesmo ambiente."
"Prepare sua operacao para credito rural, IoT e ESG."

6. Secao segmentada "Para lojistas e fornecedores"
- criar bloco proprio mostrando o valor do painel web
- destacar:
  - recebimento de cotacoes qualificadas
  - envio de propostas com mais rapidez
  - visibilidade de performance comercial
  - operacao sem mensalidade no MVP e modelo pay-per-sale
  - potencial de relacionamento com clientes recorrentes
- incluir CTA especifico: "Quero vender na iFarm"

Copy base:
Titulo:
"Para lojistas e fornecedores: mais oportunidades, mais eficiencia comercial."

Bullets:
"Receba cotacoes por produto, regiao e periodo."
"Envie propostas com mais velocidade e organizacao."
"Acompanhe conversao, desempenho e operacao em um painel web."
"Venda no modelo digital com foco em resultado."

7. Secao de diferenciais da plataforma
- apresentar os pilares da iFarm como modulos do ecossistema
- usar cards visuais fortes
- os modulos devem ser:
  - Marketplace e Cotacao Inteligente
  - Credito Rural Integrado
  - IoT e Inteligencia de Campo
  - ESG e Mercado de Carbono
- importante: comunicar que a experiencia atual ja nasce preparada para evoluir para esses modulos
- nao tratar tudo como disponivel agora se nao estiver validado. Mostrar como plataforma em expansao estruturada.

Copy base:
Titulo:
"Uma plataforma que nasce para operar o presente e construir o futuro do agro."

Descricao:
"A iFarm comeca resolvendo a jornada comercial e evolui para conectar credito, dados de campo e inteligencia ambiental em um unico ecossistema."

8. Secao de beneficios estrategicos
- usar uma secao com comparacao implicita entre modelo tradicional e iFarm
- pode ser um layout de antes/depois ou tabela visual simples
- mostrar a mudanca:
  - de conversa dispersa para fluxo organizado
  - de preco solto para proposta comparavel
  - de operacao reativa para decisao orientada por dados
  - de processos isolados para ecossistema integrado

Titulo:
"O agro nao precisa mais operar no improviso."

9. Secao de confianca, compliance e transparencia
- reforcar que a plataforma foi desenhada com preocupacao real de governanca
- destacar:
  - KYC
  - LGPD
  - trilha operacional
  - transparencia comercial
  - base preparada para Open Finance, credito rural e compliance setorial
- linguagem institucional sem ficar juridica demais

Titulo:
"Tecnologia confiavel para uma operacao que exige seriedade."

10. Secao de prova e validacao
- se nao houver depoimentos ou metricas publicas validadas, nao inventar
- nesse caso usar prova estrutural:
  - foco no agronegocio brasileiro
  - arquitetura pensada para escalabilidade
  - jornadas especificas para produtor e lojista
  - desenho preparado para marketplace, credito, IoT e ESG
- se houver espaco visual, criar placeholders elegantes para futuros cases reais

11. Secao de CTA central forte
- criar uma secao emocional e objetiva no meio/final da pagina
- objetivo: capturar lead
- titulo deve reforcar urgencia moderada e oportunidade
- ter duas opcoes de CTA e, se possivel, um seletor de perfil

Copy base:
Titulo:
"Entre agora na nova camada digital do agronegocio."

Subtexto:
"Escolha seu perfil e fale com a iFarm para conhecer a plataforma, participar da operacao inicial ou receber uma demonstracao."

CTAs:
"Quero usar o app"
"Quero usar o painel web"

12. Secao FAQ orientada a conversao e SEO
- incluir perguntas reais que ajudem no ranqueamento e reduzam objecoes
- usar perguntas como:
  - "O que e a iFarm?"
  - "Como funciona a cotacao de insumos na iFarm?"
  - "A iFarm e para produtores rurais ou para lojistas?"
  - "A iFarm ja possui credito rural integrado?"
  - "Como o painel web ajuda fornecedores e lojistas?"
  - "A iFarm tera integracao com IoT e ESG?"
  - "Como a iFarm trata seguranca e compliance?"
- respostas curtas, claras e orientadas a negocio

13. Rodape
- reforcar navegacao
- incluir logo, mini descricao institucional e links essenciais
- incluir placeholders para Politica de Privacidade, Termos de Uso, Contato e Redes
- manter visual premium e limpo

Requisitos de conversao:
- criar fluxo com CTA repetido ao longo da pagina sem parecer agressivo
- captacao principal via formulario curto
- formulario com poucos campos:
  - nome
  - perfil (produtor ou lojista)
  - telefone/WhatsApp
  - e-mail
  - cidade/estado
- usar microcopy que reduza friccao
- reforcar proximidade comercial e resposta rapida

Requisitos de copywriting:
- valor primeiro, detalhe depois
- headline e subtitulos devem ser objetivos e memoraveis
- combinar linguagem aspiracional com ganho operacional concreto
- evitar excesso de buzzwords
- sempre mostrar o beneficio pratico de cada funcionalidade
- priorizar clareza para leitura rapida em mobile

Requisitos de SEO on-page:
- estruturar a pagina com um unico H1 forte
- usar H2 e H3 semanticamente organizados
- incluir naturalmente palavras-chave relacionadas, sem keyword stuffing:
  - plataforma para agronegocio
  - marketplace agro
  - cotacao de insumos agricolas
  - app para produtor rural
  - painel web para lojistas do agro
  - credito rural digital
  - IoT no agronegocio
  - ESG no agro
  - mercado de carbono no agronegocio
- gerar sugestao de meta title com ate 60 caracteres
- gerar sugestao de meta description com ate 155 caracteres
- sugerir slug SEO-friendly
- sugerir textos para Open Graph title e description
- incluir espaco para FAQ com estrutura pensada para rich results
- considerar schema markup para Organization, WebSite e FAQ

Entregue a landing page com:
- layout desktop e mobile coerentes
- hierarquia visual premium
- secoes bem distribuidas
- componentes prontos para alta conversao
- visual consistente com a marca iFarm
- foco em captar tanto quem vai usar o app quanto quem vai usar o painel web

Evite:
- visual generico de SaaS
- excesso de roxo, azul padrao ou dark mode dominante
- icones e ilustracoes infantis
- textos vagos como "revolucione seu negocio" sem contexto
- prova social falsa
- promessas regulatoriamente sensiveis sem cautela, especialmente em ESG e carbono

No resultado final, quero uma pagina que passe esta sensacao:
"A iFarm entende o agronegocio de verdade, organiza uma jornada comercial que hoje e fragmentada e abre caminho para uma operacao mais inteligente, conectada e confiavel."
```

## Sugestoes de SEO para a pagina

### Meta title
`iFarm | Marketplace Agro com Cotacao Inteligente`

### Meta description
`Conecte produtores e lojistas em uma plataforma agro com cotacao inteligente, painel web, app mobile e evolucao para credito rural, IoT e ESG.`

### Slug sugerido
`/plataforma-agronegocio-cotacao-inteligente`

### Palavras-chave prioritarias
- plataforma para agronegocio
- marketplace agro
- cotacao de insumos agricolas
- app para produtor rural
- painel web para lojistas do agro
- credito rural digital
- IoT no agronegocio
- ESG no agro

## Observacoes de uso
- Se o Stitch permitir contexto adicional, informe que a pagina deve ser pensada para `desktop first com adaptacao mobile impecavel`.
- Se o Stitch permitir gerar componentes interativos, prefira um seletor visual de perfil no hero para separar `Produtor` e `Lojista`.
- Se houver espaco para formularios diferentes por publico, usar CTA e formulario dedicados melhora a qualificacao do lead.
- Se depois voce quiser, o proximo passo natural e transformar este prompt em `wireframe + copy final por secao`.
