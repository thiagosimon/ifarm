# iFarm — Landing Page

Plataforma digital para o agronegócio brasileiro.

## Stack
- Next.js 15 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 3
- Deploy: Netlify (static export)

## Pré-requisitos
- Node.js 20+
- npm 10+

## Instalação
cd apps/web-landing
npm install

## Desenvolvimento
npm run dev
# http://localhost:3000

## Build
npm run build
# Output em /out

## Deploy no Netlify
1. Conectar repositório no Netlify
2. Build command: `npm run build`
3. Publish directory: `out`
4. Node version: 20

Ou via CLI:
npm install -g netlify-cli
netlify deploy --prod --dir=out

## Estrutura
- app/ — Next.js App Router (layout, page, globals.css)
- components/ — Componentes reutilizáveis (ui/, layout/)
- sections/ — Seções da landing page
- lib/ — Constantes e utilitários
- types/ — Tipos TypeScript

## Design System
Tokens visuais originados do Stitch (projects/16113075432093075811).
Paleta "Fertile Earth" (verde #005129) + "Golden Harvest" (dourado #795900).
Tipografia: Inter.
Direção criativa: "The Agrarian Editorial" / "Organic Precision".
