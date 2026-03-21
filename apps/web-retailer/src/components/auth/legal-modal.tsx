'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { X, ScrollText, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ─── Content ─────────────────────────────────────────────────────────────────

const TERMS_CONTENT = {
  'pt-BR': {
    title: 'Termos de Uso e Política de Privacidade',
    lastUpdated: 'Última atualização: 20 de março de 2026',
    sections: [
      {
        heading: '1. Aceitação dos Termos',
        body: 'Ao acessar e utilizar a plataforma iFarm Lojista ("Plataforma"), você concorda integralmente com estes Termos de Uso e nossa Política de Privacidade. Se você não concordar com qualquer parte destes termos, não utilize a Plataforma.',
      },
      {
        heading: '2. Descrição do Serviço',
        body: 'A iFarm é uma plataforma de gestão agro B2B que conecta lojistas (revendedores de insumos agrícolas) a produtores rurais. Os serviços incluem: gestão de cotações, pedidos, catálogo de produtos, controle financeiro, emissão de notas fiscais e relatórios analíticos.',
      },
      {
        heading: '3. Cadastro e Elegibilidade',
        body: 'Para utilizar a Plataforma, você deve: (a) ser pessoa jurídica com CNPJ ativo e regularizado; (b) ter capacidade legal para contratar; (c) fornecer informações verdadeiras, precisas e completas no cadastro; (d) manter seus dados atualizados. A iFarm se reserva o direito de recusar ou cancelar cadastros a qualquer momento.',
      },
      {
        heading: '4. Obrigações do Usuário',
        body: 'Você se compromete a: não utilizar a Plataforma para fins ilícitos; não reproduzir, duplicar ou revender qualquer parte do serviço sem autorização expressa; manter a confidencialidade de suas credenciais de acesso; notificar imediatamente a iFarm sobre qualquer uso não autorizado de sua conta.',
      },
      {
        heading: '5. Propriedade Intelectual',
        body: 'Todo o conteúdo da Plataforma — incluindo textos, gráficos, logos, ícones, imagens, clipes de áudio, downloads digitais e compilações de dados — é propriedade da iFarm ou de seus fornecedores de conteúdo e está protegido pelas leis brasileiras de propriedade intelectual.',
      },
      {
        heading: '6. Limitação de Responsabilidade',
        body: 'A iFarm não será responsável por quaisquer danos indiretos, incidentais, especiais ou consequenciais resultantes do uso ou impossibilidade de uso da Plataforma, incluindo, entre outros, perda de dados, lucros cessantes ou interrupção de negócios.',
      },
      {
        heading: '7. Política de Privacidade',
        body: 'A iFarm coleta, armazena e processa dados pessoais conforme descrito nesta política. Os dados coletados incluem: informações de cadastro (CNPJ, razão social, e-mail, telefone, endereço), dados de uso da plataforma e informações de transações comerciais. Esses dados são utilizados para: prestação dos serviços contratados; comunicações relacionadas ao serviço; cumprimento de obrigações legais e regulatórias; melhoria contínua da plataforma.',
      },
      {
        heading: '8. Compartilhamento de Dados',
        body: 'A iFarm não vende dados pessoais a terceiros. Os dados poderão ser compartilhados com: parceiros de processamento de pagamentos; autoridades fiscais conforme exigido por lei; prestadores de serviços de tecnologia que auxiliam na operação da Plataforma, sempre sob cláusulas de confidencialidade.',
      },
      {
        heading: '9. Retenção de Dados',
        body: 'Os dados são retidos pelo período necessário para cumprir as finalidades descritas nesta política, ou conforme exigido por lei (no mínimo 5 anos para dados fiscais, conforme legislação brasileira). Após o cancelamento da conta, os dados poderão ser anonimizados ou eliminados conforme solicitado.',
      },
      {
        heading: '10. Segurança',
        body: 'A iFarm implementa medidas técnicas e organizacionais adequadas para proteger seus dados contra acesso não autorizado, alteração, divulgação ou destruição. Utilizamos criptografia TLS em todas as transmissões e armazenamento seguro com criptografia AES-256.',
      },
      {
        heading: '11. Alterações nos Termos',
        body: 'A iFarm se reserva o direito de modificar estes Termos a qualquer momento. As alterações entrarão em vigor após a publicação na Plataforma. O uso continuado da Plataforma após tais alterações constitui sua aceitação dos novos Termos.',
      },
      {
        heading: '12. Lei Aplicável e Foro',
        body: 'Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da Comarca de São Paulo – SP para dirimir quaisquer controvérsias, com renúncia a qualquer outro, por mais privilegiado que seja.',
      },
      {
        heading: '13. Contato',
        body: 'Para dúvidas sobre estes Termos ou sobre o tratamento de seus dados, entre em contato com nosso Encarregado de Proteção de Dados (DPO): dpo@ifarm.com.br',
      },
    ],
  },
  en: {
    title: 'Terms of Use and Privacy Policy',
    lastUpdated: 'Last updated: March 20, 2026',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        body: 'By accessing and using the iFarm Retailer platform ("Platform"), you fully agree to these Terms of Use and our Privacy Policy. If you do not agree with any part of these terms, do not use the Platform.',
      },
      {
        heading: '2. Service Description',
        body: 'iFarm is an agro B2B management platform connecting retailers (agricultural input resellers) with rural producers. Services include: quotation management, orders, product catalog, financial control, invoice issuance, and analytical reports.',
      },
      {
        heading: '3. Registration and Eligibility',
        body: 'To use the Platform, you must: (a) be a legal entity with an active tax registration; (b) have legal capacity to contract; (c) provide true, accurate, and complete information upon registration; (d) keep your data up to date. iFarm reserves the right to refuse or cancel registrations at any time.',
      },
      {
        heading: '4. User Obligations',
        body: 'You agree to: not use the Platform for unlawful purposes; not reproduce, duplicate, or resell any part of the service without express authorization; maintain the confidentiality of your access credentials; immediately notify iFarm of any unauthorized use of your account.',
      },
      {
        heading: '5. Intellectual Property',
        body: 'All Platform content — including text, graphics, logos, icons, images, audio clips, digital downloads, and data compilations — is the property of iFarm or its content suppliers and is protected by Brazilian intellectual property laws.',
      },
      {
        heading: '6. Limitation of Liability',
        body: 'iFarm shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use the Platform, including, without limitation, loss of data, lost profits, or business interruption.',
      },
      {
        heading: '7. Privacy Policy',
        body: 'iFarm collects, stores, and processes personal data as described in this policy. Data collected includes: registration information (tax ID, company name, email, phone, address), platform usage data, and commercial transaction information. This data is used for: providing contracted services; service-related communications; compliance with legal and regulatory obligations; continuous platform improvement.',
      },
      {
        heading: '8. Data Sharing',
        body: 'iFarm does not sell personal data to third parties. Data may be shared with: payment processing partners; tax authorities as required by law; technology service providers that assist in Platform operations, always under confidentiality clauses.',
      },
      {
        heading: '9. Data Retention',
        body: 'Data is retained for the period necessary to fulfill the purposes described in this policy, or as required by law (minimum 5 years for tax data, per Brazilian legislation). After account cancellation, data may be anonymized or deleted upon request.',
      },
      {
        heading: '10. Security',
        body: 'iFarm implements appropriate technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction. We use TLS encryption on all transmissions and secure storage with AES-256 encryption.',
      },
      {
        heading: '11. Changes to Terms',
        body: 'iFarm reserves the right to modify these Terms at any time. Changes will take effect upon publication on the Platform. Continued use of the Platform after such changes constitutes your acceptance of the new Terms.',
      },
      {
        heading: '12. Governing Law and Jurisdiction',
        body: 'These Terms are governed by the laws of the Federative Republic of Brazil. The courts of São Paulo – SP are elected to resolve any disputes, waiving any other jurisdiction, however privileged.',
      },
      {
        heading: '13. Contact',
        body: 'For questions about these Terms or the processing of your data, contact our Data Protection Officer (DPO): dpo@ifarm.com.br',
      },
    ],
  },
};

const LGPD_CONTENT = {
  'pt-BR': {
    title: 'Autorização de Tratamento de Dados — LGPD',
    lastUpdated: 'Conforme Lei nº 13.709/2018 (Lei Geral de Proteção de Dados)',
    sections: [
      {
        heading: '1. Controlador dos Dados',
        body: 'O controlador dos seus dados pessoais é a iFarm Tecnologia Agro S.A., inscrita no CNPJ sob o nº [CNPJ iFarm], com sede em São Paulo – SP. Para contato: dpo@ifarm.com.br.',
      },
      {
        heading: '2. Dados Coletados',
        body: 'Coletamos as seguintes categorias de dados pessoais: (a) Dados de identificação: CNPJ, razão social, nome fantasia, nome do responsável; (b) Dados de contato: e-mail corporativo, telefone comercial, endereço; (c) Dados bancários: banco, agência, conta (para repasses); (d) Dados de uso: logs de acesso, ações na plataforma, preferências; (e) Dados de transações: cotações, pedidos, valores financeiros.',
      },
      {
        heading: '3. Finalidades do Tratamento',
        body: 'Seus dados são tratados para: (a) Execução do contrato — prestação dos serviços da plataforma; (b) Cumprimento de obrigação legal — emissão de notas fiscais, recolhimento de tributos; (c) Legítimo interesse — prevenção a fraudes, segurança da plataforma, melhoria dos serviços; (d) Com seu consentimento — envio de comunicações de marketing e novidades da iFarm.',
      },
      {
        heading: '4. Base Legal',
        body: 'O tratamento de dados é fundamentado nas seguintes bases legais da LGPD: Art. 7º, II (cumprimento de obrigação legal); Art. 7º, V (execução de contrato); Art. 7º, IX (legítimo interesse); Art. 7º, I (consentimento, para finalidades específicas).',
      },
      {
        heading: '5. Seus Direitos',
        body: 'Como titular dos dados, você tem direito a: (a) Confirmação da existência de tratamento; (b) Acesso aos seus dados; (c) Correção de dados incompletos, inexatos ou desatualizados; (d) Anonimização, bloqueio ou eliminação de dados desnecessários; (e) Portabilidade dos dados a outro fornecedor; (f) Eliminação dos dados tratados com consentimento; (g) Informação sobre compartilhamento de dados; (h) Revogação do consentimento a qualquer momento.',
      },
      {
        heading: '6. Como Exercer seus Direitos',
        body: 'Para exercer qualquer um dos direitos acima, acesse "Configurações > Privacidade" na plataforma ou entre em contato com nosso DPO pelo e-mail dpo@ifarm.com.br. Responderemos em até 15 dias úteis.',
      },
      {
        heading: '7. Transferência Internacional',
        body: 'Seus dados poderão ser transferidos para servidores localizados fora do Brasil (ex.: AWS us-east-1) apenas quando garantidas as proteções adequadas conforme os artigos 33 a 36 da LGPD, incluindo cláusulas contratuais padrão.',
      },
      {
        heading: '8. Cookies e Tecnologias de Rastreamento',
        body: 'Utilizamos cookies essenciais (necessários para funcionamento da plataforma) e cookies analíticos (para entender o uso da plataforma). Você pode gerenciar preferências de cookies nas configurações do seu navegador. Cookies essenciais não podem ser desativados.',
      },
      {
        heading: '9. Incidentes de Segurança',
        body: 'Em caso de incidente de segurança que possa acarretar risco ou dano relevante aos titulares, a iFarm notificará a Autoridade Nacional de Proteção de Dados (ANPD) e os titulares afetados em prazo razoável, conforme art. 48 da LGPD.',
      },
      {
        heading: '10. Consentimento',
        body: 'Ao marcar esta caixa, você: (a) Confirma ter lido e compreendido esta autorização; (b) Consente com o tratamento dos seus dados pessoais para as finalidades indicadas; (c) Declara que as informações fornecidas são verdadeiras; (d) Confirma ter pelo menos 18 anos de idade ou ser representante legal da empresa cadastrada. Você pode revogar este consentimento a qualquer momento, sem prejuízo da licitude do tratamento realizado anteriormente.',
      },
    ],
  },
  en: {
    title: 'Data Processing Authorization — LGPD (Brazilian Data Protection Law)',
    lastUpdated: 'Pursuant to Law No. 13,709/2018 (Brazilian General Data Protection Law)',
    sections: [
      {
        heading: '1. Data Controller',
        body: 'The controller of your personal data is iFarm Tecnologia Agro S.A., registered under CNPJ [iFarm CNPJ], headquartered in São Paulo – SP, Brazil. Contact: dpo@ifarm.com.br.',
      },
      {
        heading: '2. Data Collected',
        body: 'We collect the following categories of personal data: (a) Identification data: tax ID, company name, trade name, responsible person\'s name; (b) Contact data: corporate email, business phone, address; (c) Banking data: bank, branch, account number (for payouts); (d) Usage data: access logs, platform actions, preferences; (e) Transaction data: quotations, orders, financial amounts.',
      },
      {
        heading: '3. Processing Purposes',
        body: 'Your data is processed for: (a) Contract execution — providing platform services; (b) Legal obligation compliance — invoice issuance, tax collection; (c) Legitimate interest — fraud prevention, platform security, service improvement; (d) With your consent — sending marketing communications and iFarm updates.',
      },
      {
        heading: '4. Legal Basis',
        body: 'Data processing is based on the following LGPD legal grounds: Art. 7, II (legal obligation compliance); Art. 7, V (contract execution); Art. 7, IX (legitimate interest); Art. 7, I (consent, for specific purposes).',
      },
      {
        heading: '5. Your Rights',
        body: 'As a data subject, you have the right to: (a) Confirmation of processing existence; (b) Access to your data; (c) Correction of incomplete, inaccurate, or outdated data; (d) Anonymization, blocking, or deletion of unnecessary data; (e) Data portability to another provider; (f) Deletion of consent-based processed data; (g) Information about data sharing; (h) Revocation of consent at any time.',
      },
      {
        heading: '6. How to Exercise Your Rights',
        body: 'To exercise any of the rights above, go to "Settings > Privacy" on the platform or contact our DPO at dpo@ifarm.com.br. We will respond within 15 business days.',
      },
      {
        heading: '7. International Transfer',
        body: 'Your data may be transferred to servers located outside Brazil (e.g., AWS us-east-1) only when adequate protections are guaranteed pursuant to LGPD articles 33 to 36, including standard contractual clauses.',
      },
      {
        heading: '8. Cookies and Tracking Technologies',
        body: 'We use essential cookies (necessary for platform operation) and analytical cookies (to understand platform usage). You can manage cookie preferences in your browser settings. Essential cookies cannot be disabled.',
      },
      {
        heading: '9. Security Incidents',
        body: 'In the event of a security incident that may pose relevant risk or harm to data subjects, iFarm will notify the National Data Protection Authority (ANPD) and affected data subjects within a reasonable timeframe, as per LGPD art. 48.',
      },
      {
        heading: '10. Consent',
        body: 'By checking this box, you: (a) Confirm having read and understood this authorization; (b) Consent to the processing of your personal data for the indicated purposes; (c) Declare that the information provided is truthful; (d) Confirm you are at least 18 years old or are the legal representative of the registered company. You may revoke this consent at any time, without prejudice to the lawfulness of processing carried out previously.',
      },
    ],
  },
};

// ─── Generic Legal Modal ──────────────────────────────────────────────────────

type LegalType = 'terms' | 'lgpd';

interface LegalModalProps {
  type: LegalType;
  open: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

export function LegalModal({ type, open, onClose, onAccept }: LegalModalProps) {
  const locale = useLocale();
  const lang = locale === 'pt-BR' ? 'pt-BR' : 'en';
  const content = type === 'terms' ? TERMS_CONTENT[lang] : LGPD_CONTENT[lang];
  const Icon = type === 'terms' ? ScrollText : Shield;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative z-50 w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl border border-outline-variant/50 bg-surface-container shadow-2xl">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-outline-variant/30 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-black text-on-surface">{content.title}</h2>
                <p className="mt-0.5 text-xs text-on-surface-variant">{content.lastUpdated}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-on-surface"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Fechar</span>
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {content.sections.map((section) => (
              <div key={section.heading}>
                <h3 className="mb-1.5 text-sm font-bold text-on-surface">{section.heading}</h3>
                <p className="text-sm leading-relaxed text-on-surface-variant">{section.body}</p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-outline-variant/30 px-6 py-4">
            <Button variant="outline" size="sm" className="border-outline-variant/30" onClick={onClose}>
              {lang === 'pt-BR' ? 'Fechar' : 'Close'}
            </Button>
            {onAccept && (
              <Button size="sm" onClick={() => { onAccept(); onClose(); }}>
                {lang === 'pt-BR' ? 'Li e Aceito' : 'I Accept'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
