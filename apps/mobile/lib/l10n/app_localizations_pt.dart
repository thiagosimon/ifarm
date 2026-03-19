// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Portuguese (`pt`).
class AppLocalizationsPt extends AppLocalizations {
  AppLocalizationsPt([String locale = 'pt']) : super(locale);

  @override
  String get appName => 'iFarm';

  @override
  String get tryAgain => 'Tentar Novamente';

  @override
  String get cancel => 'Cancelar';

  @override
  String get confirm => 'Confirmar';

  @override
  String get save => 'Salvar';

  @override
  String get send => 'Enviar';

  @override
  String get errorGeneric => 'Algo deu errado';

  @override
  String get errorGenericMessage => 'Verifique sua conexão e tente novamente.';

  @override
  String get errorUnknown => 'Erro desconhecido';

  @override
  String get errorTimeout =>
      'Tempo de conexão esgotado. Verifique sua internet.';

  @override
  String get errorNoConnection => 'Sem conexão com a internet.';

  @override
  String get errorSomethingWrong => 'Algo deu errado. Tente novamente.';

  @override
  String get subtotal => 'Subtotal';

  @override
  String get total => 'TOTAL';

  @override
  String get freight => 'Frete';

  @override
  String get free => 'Grátis';

  @override
  String get businessDays => 'dias úteis';

  @override
  String get toNegotiate => 'A combinar';

  @override
  String get navHome => 'Home';

  @override
  String get navQuotes => 'Cotações';

  @override
  String get navOrders => 'Pedidos';

  @override
  String get navAlerts => 'Alertas';

  @override
  String get navProfile => 'Perfil';

  @override
  String get welcomeSlideTitle1 => 'Compre pelo\nmelhor preço';

  @override
  String get welcomeSlideDesc1 =>
      'Acesse uma rede global de fornecedores agrícolas direto do seu celular.';

  @override
  String get welcomeSlideTitle2 => 'Receba múltiplas\ncotações';

  @override
  String get welcomeSlideDesc2 =>
      'Compare ofertas em tempo real e garanta a melhor rentabilidade para sua safra.';

  @override
  String get welcomeSlideTitle3 => 'Gerencie\ndo campo';

  @override
  String get welcomeSlideDesc3 =>
      'Toda a gestão de insumos e logística na palma da mão, onde você estiver.';

  @override
  String get welcomeCreateAccount => 'Criar Conta';

  @override
  String get welcomeLogin => 'Entrar';

  @override
  String get welcomeTagline => 'O MERCADO DIGITAL DO AGRONEGÓCIO';

  @override
  String get loginSubtitle => 'Gerencie seu patrimônio com precisão digital.';

  @override
  String get loginEmail => 'E-mail';

  @override
  String get loginPassword => 'Senha';

  @override
  String get loginForgotPassword => 'Esqueci a senha?';

  @override
  String get loginButton => 'Entrar';

  @override
  String get loginOrAccessWith => 'Ou acesse com';

  @override
  String get loginGoogle => 'Google';

  @override
  String get loginBiometrics => 'Biometria';

  @override
  String get loginNoAccount => 'Ainda não tem conta? ';

  @override
  String get loginCreateAccount => 'Criar conta';

  @override
  String get registrationTitle => 'Criar Conta';

  @override
  String get registrationPersonalData => 'Dados Pessoais';

  @override
  String get registrationFullName => 'Nome completo';

  @override
  String get registrationCpf => 'CPF';

  @override
  String get registrationEmail => 'E-mail';

  @override
  String get registrationPhone => 'Telefone';

  @override
  String get registrationPassword => 'Senha';

  @override
  String get registrationPropertyDetails => 'Detalhes da Propriedade';

  @override
  String get registrationPropertyName => 'Nome da propriedade';

  @override
  String get registrationTotalArea => 'Área total (ha)';

  @override
  String get registrationZipCode => 'CEP';

  @override
  String get registrationState => 'Estado';

  @override
  String get registrationSelectState => 'Selecione um estado';

  @override
  String get registrationGpsCoordinates => 'Coordenadas GPS';

  @override
  String get registrationTapToCapture => 'Toque para capturar localização';

  @override
  String get registrationCapture => 'CAPTURAR';

  @override
  String get registrationTermsTitle => 'Termos e Privacidade';

  @override
  String get registrationAcceptTerms =>
      'Aceito os Termos de Uso. Compreendo como meus dados serão processados conforme as diretrizes da LGPD.';

  @override
  String get registrationReadTerms => 'Ler Termos de Uso';

  @override
  String get registrationMarketingConsent =>
      'Quero receber relatórios de cotações e novidades do agronegócio via E-mail e WhatsApp.';

  @override
  String get registrationCreateAccountButton => 'Criar Conta';

  @override
  String get registrationLoginButton => 'Fazer Login';

  @override
  String get registrationAcceptTermsError =>
      'Aceite os Termos de Uso para continuar.';

  @override
  String get homeGreeting => 'Bom dia,';

  @override
  String homeHello(String firstName) {
    return 'Olá, $firstName!';
  }

  @override
  String get homeFarmerDefault => 'Agricultor';

  @override
  String get homeSearchPlaceholder => 'Buscar insumos, máquinas ou pedidos...';

  @override
  String get homeNewQuote => 'Nova Cotação';

  @override
  String get homeMyQuotes => 'Minhas Cotações';

  @override
  String get homeMyOrders => 'Meus Pedidos';

  @override
  String get homeRecurring => 'Recorrentes';

  @override
  String get homeCategories => 'Categorias';

  @override
  String get homeViewAll => 'Ver Tudo';

  @override
  String get homeViewAllCaps => 'VER TUDO';

  @override
  String get homeRecentQuotes => 'Cotações Recentes';

  @override
  String get homeViewAllQuotes => 'Ver Todas';

  @override
  String get homeCategoryAll => 'Tudo';

  @override
  String get homeCategoryPesticides => 'Defensivos';

  @override
  String get homeCategorySeeds => 'Sementes';

  @override
  String get homeCategoryNutrition => 'Nutrição';

  @override
  String get homeCategoryMachinery => 'Máquinas';

  @override
  String get homeCategoryIrrigation => 'Irrigação';

  @override
  String homeItemCount(int count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count itens',
      one: '1 item',
    );
    return '$_temp0';
  }

  @override
  String get splashDigitalEstate => 'DIGITAL ESTATE';

  @override
  String get splashStartingSeason => 'INICIANDO SAFRA';

  @override
  String get kycIdFront => 'Identidade (Frente)';

  @override
  String get kycIdFrontDesc => 'RG ou CNH (frente)';

  @override
  String get kycIdBack => 'Identidade (Verso)';

  @override
  String get kycIdBackDesc => 'RG ou CNH (verso)';

  @override
  String get kycAddressProof => 'Comprovante de Endereço';

  @override
  String get kycAddressProofDesc => 'Conta de Luz/Água';

  @override
  String get kycRuralDoc => 'Doc. Produtor Rural';

  @override
  String get kycRuralDocDesc => 'Cadastro estadual ou DAP';

  @override
  String get kycDocumentSentSuccess => 'Documento enviado com sucesso!';

  @override
  String get kycDocumentSentError => 'Erro ao enviar documento.';

  @override
  String get kycCamera => 'Câmera';

  @override
  String get kycGallery => 'Galeria';

  @override
  String get kycIdentityVerified => 'Identidade Verificada';

  @override
  String get kycUnderReview => 'Em análise';

  @override
  String get kycDocumentCenter => 'Central de Documentos';

  @override
  String get kycDocumentCenterDesc =>
      'Mantenha sua propriedade regularizada e em conformidade.';

  @override
  String get kycSent => 'enviados';

  @override
  String get kycRealtimeAnalysis => 'Análise em tempo real · 4 horas úteis';

  @override
  String get kycResend => 'Re-enviar';

  @override
  String get kycSendButton => 'Enviar';

  @override
  String get kycContinue => 'Continuar';

  @override
  String get productSearchTitle => 'Encontre o melhor\npara sua safra.';

  @override
  String get productSearchPlaceholder => 'Buscar defensivos, sementes...';

  @override
  String get productSearchFilters => 'Filtros';

  @override
  String get productSearchRuralCredit => 'CRÉDITO RURAL';

  @override
  String get productSearchEligible => 'Elegível';

  @override
  String get productSearchAll => 'Todos';

  @override
  String get productSearchApplyFilters => 'Aplicar Filtros';

  @override
  String get productSearchAvailable => 'PRODUTOS DISPONÍVEIS';

  @override
  String get productSearchError => 'Erro ao carregar produtos';

  @override
  String get productSearchNoResults => 'Nenhum produto encontrado';

  @override
  String get productSearchNoResultsHint =>
      'Tente outros termos ou remova os filtros';

  @override
  String get productSearchAddedToQuote => 'Adicionado à cotação';

  @override
  String get productDetailError => 'Erro ao carregar produto';

  @override
  String get productDetailRuralCredit => 'CRÉDITO RURAL';

  @override
  String get productDetailPriceOnRequest => 'Preço sob consulta';

  @override
  String get productDetailAvailable => 'Disponível';

  @override
  String get productDetailDemandIndex => 'ÍNDICE DE DEMANDA REGIONAL';

  @override
  String get productDetailDescription => 'DESCRIÇÃO DO ATIVO';

  @override
  String get productDetailDefaultDesc => 'Produto premium para sua safra.';

  @override
  String get productDetailSpecs => 'ESPECIFICAÇÕES';

  @override
  String get productDetailGuarantee => 'Garantia iFarm';

  @override
  String get productDetailInspection => 'Inspeção técnica certificada incluída';

  @override
  String get productDetailAddToQuote => 'Adicionar à Cotação';

  @override
  String get productDetailAddedToQuote => 'Adicionado à cotação';

  @override
  String get quoteBuilderPaymentPix => 'PIX · imediato';

  @override
  String get quoteBuilderPaymentRural => 'Crédito Rural · aprovação 48h';

  @override
  String get quoteBuilderPaymentBoleto => 'Boleto · 30/60 dias';

  @override
  String get quoteBuilderPaymentCard => 'Cartão de Crédito';

  @override
  String get quoteBuilderSentSuccess => 'Cotação enviada com sucesso!';

  @override
  String get quoteBuilderEmptyCart => 'Carrinho vazio';

  @override
  String get quoteBuilderEmptyCartHint =>
      'Adicione produtos para criar um orçamento';

  @override
  String get quoteBuilderSearchProducts => 'Buscar Produtos';

  @override
  String quoteBuilderItems(int count) {
    return 'Itens ($count)';
  }

  @override
  String get quoteBuilderDeliveryMode => 'Modo de Entrega';

  @override
  String get quoteBuilderPaymentMethod => 'Forma de Pagamento';

  @override
  String get quoteBuilderValidity => 'Prazo de Validade';

  @override
  String get quoteBuilderTitle => 'Novo Orçamento';

  @override
  String get quoteBuilderSending => 'Enviando...';

  @override
  String get quoteBuilderSendQuote => 'Enviar Cotação';

  @override
  String get myQuotesTabActive => 'Ativas';

  @override
  String get myQuotesTabWithProposals => 'Com Propostas';

  @override
  String get myQuotesTabAccepted => 'Aceitas';

  @override
  String get myQuotesTabExpired => 'Expiradas';

  @override
  String get myQuotesSearch => 'Buscar';

  @override
  String get myQuotesRecurring => 'Recorrentes';

  @override
  String get myQuotesEmpty => 'Nenhuma cotação';

  @override
  String get myQuotesEmptyHint => 'Suas cotações aparecerão aqui';

  @override
  String get myQuotesBestOffer => 'Melhor oferta: ';

  @override
  String get quoteDetailTitle => 'Detalhe da Cotação';

  @override
  String get quoteDetailExpiresIn => 'Expira em';

  @override
  String get quoteDetailPayment => 'Pagamento';

  @override
  String get quoteDetailDelivery => 'Entrega';

  @override
  String get quoteDetailRequestedItems => 'Itens solicitados';

  @override
  String quoteDetailProposals(int count) {
    return 'Propostas ($count)';
  }

  @override
  String get quoteDetailCompare => 'Comparar';

  @override
  String get quoteDetailRecommended => 'RECOMENDADO';

  @override
  String get proposalComparisonTitle => 'Comparar Propostas';

  @override
  String get proposalComparisonEmpty => 'Nenhuma proposta disponível';

  @override
  String get proposalComparisonBestValue => 'MELHOR VALOR';

  @override
  String get proposalComparisonFastDelivery => 'ENTREGA RÁPIDA';

  @override
  String get proposalComparisonTaxes => 'Impostos';

  @override
  String get proposalComparisonAccept => 'Aceitar Proposta';

  @override
  String proposalComparisonSavings(String value) {
    return 'Economia estimada de R\$ $value vs. média regional';
  }

  @override
  String get proposalDetailAccepted => 'Proposta aceita! Pedido criado.';

  @override
  String get proposalDetailTitle => 'Detalhes da Proposta';

  @override
  String get proposalDetailFreightCif => 'FRETE CIF';

  @override
  String get proposalDetailFreightFob => 'FRETE FOB';

  @override
  String get proposalDetailItems => 'Itens';

  @override
  String get proposalDetailIcms => 'ICMS';

  @override
  String get proposalDetailDifal => 'DIFAL';

  @override
  String get proposalDetailSt => 'ST';

  @override
  String get proposalDetailTotalWithTaxes => 'TOTAL C/ IMPOSTOS E FRETE';

  @override
  String get proposalDetailNotes => 'Observações';

  @override
  String get proposalDetailConfirmOrder => 'Sim, Confirmar Pedido';

  @override
  String get proposalDetailGoBack => 'Voltar e Revisar';

  @override
  String get proposalDetailConfirmTitle => 'Confirmar Pedido';

  @override
  String get proposalDetailConfirmMessage =>
      'Esta ação não pode ser desfeita. Ao confirmar, um pedido será criado.';

  @override
  String get recurringQuotesNewTitle => 'Nova Cotação Recorrente';

  @override
  String get recurringQuotesProduct => 'Produto (ID ou nome)';

  @override
  String get recurringQuotesQuantity => 'Quantidade';

  @override
  String get recurringQuotesFrequency => 'Frequência';

  @override
  String get recurringQuotesCreate => 'Criar Recorrente';

  @override
  String get recurringQuotesTitle => 'Cotações Recorrentes';

  @override
  String get recurringQuotesEmpty => 'Sem cotações recorrentes';

  @override
  String get recurringQuotesEmptyHint =>
      'Crie uma para automatizar suas compras';

  @override
  String recurringQuotesNextDate(String date) {
    return 'Próxima Data: $date';
  }

  @override
  String get ordersTabAwaitingPayment => 'Ag. Pagamento';

  @override
  String get ordersTabPaid => 'Pagos';

  @override
  String get ordersTabDispatched => 'Enviados';

  @override
  String get ordersTabDelivered => 'Entregues';

  @override
  String get ordersNoOrders => 'Nenhum pedido';

  @override
  String get ordersNoOrdersHint => 'Nenhum pedido com este status.';

  @override
  String get ordersPayNow => 'Pagar Agora';

  @override
  String get ordersViewDetails => 'Ver Detalhes';

  @override
  String get ordersTrack => 'Rastrear';

  @override
  String get ordersConfirmReceipt => 'Confirmar Recebimento';

  @override
  String get ordersUnknownRetailer => 'Varejista desconhecido';

  @override
  String ordersItemCount(int count) {
    return '$count item(s)';
  }

  @override
  String get ordersTotal => 'Total';

  @override
  String get orderDetailTitle => 'Pedido';

  @override
  String get orderDetailReceiptConfirmed =>
      'Recebimento confirmado com sucesso!';

  @override
  String get orderDetailReceiptError => 'Erro ao confirmar recebimento.';

  @override
  String get orderDetailDisputeOpened => 'Disputa aberta com sucesso.';

  @override
  String get orderDetailDisputeError => 'Erro ao abrir disputa.';

  @override
  String get orderDetailConfirmReceiptTitle => 'Confirmar Recebimento';

  @override
  String get orderDetailConfirmReceiptMessage =>
      'Confirmar que recebeu o pedido?';

  @override
  String get orderDetailConfirmReceiptWarning =>
      'Ao confirmar, o pagamento será liberado ao fornecedor. Esta ação não pode ser desfeita.';

  @override
  String get orderDetailOpenDispute => 'Abrir Disputa';

  @override
  String get orderDetailDisputeReason => 'Descreva o motivo da disputa:';

  @override
  String get orderDetailDisputeReasonLabel => 'Motivo';

  @override
  String get orderDetailDisputeReasonHint =>
      'Ex: Produto não chegou, produto avariado...';

  @override
  String get orderDetailSendDispute => 'Enviar Disputa';

  @override
  String get orderDetailRateSupplier => 'Avaliar Fornecedor';

  @override
  String get orderDetailRateComingSoon =>
      'Funcionalidade de avaliação em breve.';

  @override
  String get orderDetailStepCreated => 'Criado';

  @override
  String get orderDetailStepPaid => 'Pago';

  @override
  String get orderDetailStepInTransit => 'Em Trânsito';

  @override
  String get orderDetailStepDelivered => 'Entregue';

  @override
  String get orderDetailOrderStatus => 'Status do Pedido';

  @override
  String get orderDetailReasonLabel => 'Motivo:';

  @override
  String get orderDetailTimeline => 'Acompanhamento';

  @override
  String get orderDetailTracking => 'Rastreio: ';

  @override
  String get orderDetailCityState => 'Cidade, UF';

  @override
  String get orderDetailOrderItems => 'Itens do Pedido';

  @override
  String paymentCopied(String label) {
    return '$label copiado!';
  }

  @override
  String get paymentViaPix => 'Pagamento via PIX';

  @override
  String get paymentError => 'Erro ao carregar pagamento';

  @override
  String get paymentPixTitle => 'Pagamento PIX';

  @override
  String get paymentPixInstructions =>
      'Abra o app do seu banco e escolha a opção Pagar com QR Code';

  @override
  String get paymentCopyPixCode => 'Copiar código PIX';

  @override
  String get paymentPixCode => 'Código PIX';

  @override
  String get paymentNeedHelp => 'Preciso de ajuda com o PIX';

  @override
  String get paymentSecure => 'Pagamento processado com segurança';

  @override
  String get paymentOrderGenerated => 'Pedido Gerado';

  @override
  String get paymentAwaitingPayment => 'Aguardando Pagamento';

  @override
  String get paymentCodeExpires => 'O código expira em 2 horas';

  @override
  String get paymentPreparingShipment => 'Preparação para Envio';

  @override
  String get paymentPending => 'Pendente';

  @override
  String get paymentBoleto => 'Boleto Bancário';

  @override
  String paymentBoletoExpiry(String date) {
    return 'Vencimento: $date';
  }

  @override
  String get paymentDigitableLine => 'Linha digitável';

  @override
  String get paymentCopyDigitableLine => 'Copiar linha digitável';

  @override
  String get paymentOpenBoleto => 'Abrir boleto no navegador';

  @override
  String get paymentConfirmed => 'Pagamento confirmado!';

  @override
  String get paymentProcessing => 'Seu pedido está sendo processado.';

  @override
  String get paymentBackToOrder => 'Voltar ao pedido';

  @override
  String get paymentExpired =>
      'Este pagamento expirou. Entre em contato com o suporte.';

  @override
  String get paymentAboutBoleto => 'Sobre o boleto:';

  @override
  String get paymentBoletoClearing => 'Prazo de compensação: até 3 dias úteis';

  @override
  String get paymentBoletoWhere =>
      'Pague em qualquer banco, lotérica ou pelo internet banking';

  @override
  String get paymentBoletoExpiredNote =>
      'Após o vencimento, o boleto não poderá ser pago';

  @override
  String get profileError => 'Erro ao carregar perfil.';

  @override
  String get profileMyAccount => 'Minha Conta';

  @override
  String get profileEditProfile => 'Editar Perfil';

  @override
  String get profilePayment => 'Pagamento';

  @override
  String get profileNotifications => 'Notificações';

  @override
  String get profileSettings => 'Configurações';

  @override
  String get profilePrivacyLgpd => 'Privacidade e LGPD';

  @override
  String get profileHelp => 'Ajuda';

  @override
  String get profileSecurity => 'Segurança';

  @override
  String get profileLogout => 'Sair';

  @override
  String get profileFarmerDefault => 'Agricultor';

  @override
  String get profileAssets => 'Patrimônio';

  @override
  String get profileQuotes => 'Cotações';

  @override
  String get profileOrders => 'Pedidos';

  @override
  String get profileSeasonGoal => 'META DA SAFRA';

  @override
  String get profileSacks => '2.400 Sacas';

  @override
  String get profileGoalReached => '85% atingido';

  @override
  String get profileLogoutConfirm => 'Deseja sair da conta?';

  @override
  String get profileLogoutMessage =>
      'Você precisará fazer login novamente para acessar o iFarm.';

  @override
  String get editProfileSuccess => 'Perfil atualizado com sucesso!';

  @override
  String get editProfileError => 'Erro ao salvar perfil. Tente novamente.';

  @override
  String get editProfileTitle => 'Editar Perfil';

  @override
  String get editProfilePersonalData => 'DADOS PESSOAIS';

  @override
  String get editProfileFullName => 'Nome completo';

  @override
  String get editProfileFullNameHint => 'Seu nome completo';

  @override
  String get editProfileNameRequired => 'Nome é obrigatório';

  @override
  String get editProfilePhone => 'Telefone / WhatsApp';

  @override
  String get editProfilePhoneHint => '(00) 00000-0000';

  @override
  String get editProfilePhoneRequired => 'Telefone é obrigatório';

  @override
  String get editProfilePhoneInvalid => 'Telefone inválido';

  @override
  String get editProfileCpf => 'CPF';

  @override
  String get editProfileCpfHint => '000.000.000-00';

  @override
  String get editProfileFarm => 'FAZENDA';

  @override
  String get editProfileFarmName => 'Nome da fazenda';

  @override
  String get editProfileFarmNameHint => 'Ex: Fazenda Santa Fé';

  @override
  String get editProfileState => 'Estado';

  @override
  String get editProfileSelectState => 'Selecione o estado';

  @override
  String get editProfileAddress => 'Endereço da Propriedade';

  @override
  String get editProfileAddressHint => 'Ex: Rodovia BR-163, km 45';

  @override
  String get editProfileAdjustOnMap => 'Ajustar no Mapa';

  @override
  String get editProfileTotalArea => 'Área total (ha)';

  @override
  String get editProfileTotalAreaHint => 'Ex: 500';

  @override
  String get editProfileCrops => 'Culturas (separadas por vírgula)';

  @override
  String get editProfileCropsHint => 'Ex: Soja, Milho, Trigo';

  @override
  String get editProfileSave => 'Salvar Alterações';

  @override
  String get editProfileChangePhoto => 'ALTERAR FOTO';

  @override
  String get settingsTitle => 'Configurações';

  @override
  String get settingsPreferencesSaved => 'Preferências salvas!';

  @override
  String get settingsPreferencesError => 'Erro ao salvar preferências.';

  @override
  String get settingsNewQuotes => 'Novas cotações';

  @override
  String get settingsProposalsReceived => 'Propostas recebidas';

  @override
  String get settingsOrderUpdates => 'Atualizações de pedidos';

  @override
  String get settingsPaymentConfirmations => 'Confirmações de pagamento';

  @override
  String get settingsAppSection => 'Aplicativo';

  @override
  String get settingsAppVersion => 'Versão do aplicativo';

  @override
  String get settingsAccountSection => 'Conta';

  @override
  String get settingsPrivacyPolicy => 'Política de Privacidade';

  @override
  String get settingsExportData => 'Exportar meus dados';

  @override
  String get settingsDeleteAccount => 'Excluir conta';

  @override
  String get settingsSavePreferences => 'Salvar Preferências';

  @override
  String get settingsDeleteAccountMessage =>
      'Para excluir sua conta acesse a seção Privacidade e LGPD. O processo é irreversível.';

  @override
  String get settingsContinue => 'Continuar';

  @override
  String get privacyTitle => 'Privacidade';

  @override
  String get privacyYourRights => 'Seus Direitos LGPD';

  @override
  String get privacyConsents => 'Consentimentos';

  @override
  String get privacyTermsOfUse => 'Termos de Uso';

  @override
  String get privacyPrivacyPolicy => 'Política de Privacidade';

  @override
  String get privacyMarketingComms => 'Comunicações de Marketing';

  @override
  String get privacyMarketingDesc => 'Receba promoções e novidades do iFarm';

  @override
  String privacyAcceptedOn(String date) {
    return 'Aceito em $date';
  }

  @override
  String get privacyStorageUsage => 'USO DO ARMAZENAMENTO';

  @override
  String get privacyExportData => 'Exportar meus dados';

  @override
  String get privacyExportDataDesc =>
      'Receba um arquivo JSON e CSV com todos os seus dados pessoais armazenados na plataforma iFarm.';

  @override
  String get privacyDangerZone => 'Zona de Risco';

  @override
  String get privacyDeleteAccount => 'Excluir minha conta';

  @override
  String get privacyDeleteAccountDesc =>
      'Solicite a exclusão permanente de todos os seus dados. Esta ação é irreversível e implica encerramento de contratos ativos.';

  @override
  String get privacyRightAccess => 'Acesso';

  @override
  String get privacyRightCorrection => 'Correção';

  @override
  String get privacyRightDeletion => 'Exclusão';

  @override
  String get privacyRightPortability => 'Portabilidade';

  @override
  String get privacyRightRevocation => 'Revogação de Consentimento';

  @override
  String get privacyExportError => 'Erro ao exportar dados. Tente novamente.';

  @override
  String privacyStorageInfo(String used, String total) {
    return '$used de $total utilizados';
  }

  @override
  String privacyCompanyInfo(String version) {
    return 'iFarm Tecnologia Ltda. • CNPJ 00.000.000/0001-00 • v$version';
  }

  @override
  String get notificationsTitle => 'Notificações';

  @override
  String get notificationsMarkAllRead => 'Marcar todas como lidas';

  @override
  String get notificationsError => 'Erro ao carregar notificações.';

  @override
  String get notificationsAllClear => 'Tudo limpo por aqui';

  @override
  String get notificationsAllClearHint =>
      'Você será notificado sobre cotações,\npedidos e pagamentos aqui.';

  @override
  String get notificationsChipQuote => 'Cotação';

  @override
  String get notificationsChipOrder => 'Pedido';

  @override
  String get notificationsChipPayment => 'Pagamento';

  @override
  String get notificationsChipDelivery => 'Entrega';

  @override
  String get notificationsChipKyc => 'KYC';

  @override
  String get notificationsChipSystem => 'Sistema';

  @override
  String get notificationsGroupToday => 'Hoje';

  @override
  String get notificationsGroupYesterday => 'Ontem';

  @override
  String get notificationsGroupThisWeek => 'Esta semana';

  @override
  String get notificationsGroupOlder => 'Mais antigas';

  @override
  String get quoteStatusOpen => 'Aberta';

  @override
  String get quoteStatusInProposals => 'Com Propostas';

  @override
  String get quoteStatusAccepted => 'Aceita';

  @override
  String get quoteStatusExpired => 'Expirada';

  @override
  String get quoteStatusCancelled => 'Cancelada';

  @override
  String get orderStatusAwaitingPayment => 'Ag. Pagamento';

  @override
  String get orderStatusPaid => 'Pago';

  @override
  String get orderStatusPreparing => 'Preparando';

  @override
  String get orderStatusDispatched => 'Enviado';

  @override
  String get orderStatusDelivered => 'Entregue';

  @override
  String get orderStatusDisputed => 'Em Disputa';

  @override
  String get orderStatusCancelled => 'Cancelado';

  @override
  String get orderStatusRefunded => 'Reembolsado';

  @override
  String get paymentMethodPix => 'PIX';

  @override
  String get paymentMethodBoleto => 'Boleto';

  @override
  String get paymentMethodCreditCard => 'Cartão de Crédito';

  @override
  String get paymentMethodRuralCredit => 'Crédito Rural';

  @override
  String get deliveryModeAddress => 'Entrega no Endereço';

  @override
  String get deliveryModeGeolocation => 'Entrega por GPS';

  @override
  String get deliveryModeStorePickup => 'Retirada na Loja';

  @override
  String get kycStatusNotStarted => 'Não Iniciado';

  @override
  String get kycStatusDocumentsSubmitted => 'Docs Enviados';

  @override
  String get kycStatusUnderReview => 'Em Análise';

  @override
  String get kycStatusApproved => 'Aprovado';

  @override
  String get kycStatusRejected => 'Rejeitado';

  @override
  String get kycStatusResubmissionRequired => 'Reenvio Necessário';

  @override
  String get recurringFrequencyWeekly => 'Semanal';

  @override
  String get recurringFrequencyBiweekly => 'Quinzenal';

  @override
  String get recurringFrequencyMonthly => 'Mensal';

  @override
  String get recurringFrequencyCustom => 'Personalizado';

  @override
  String get recurringStatusActive => 'Ativa';

  @override
  String get recurringStatusPaused => 'Pausada';

  @override
  String get recurringStatusCancelled => 'Cancelada';

  @override
  String get productCategoryFertilizers => 'Fertilizantes';

  @override
  String get productCategoryPesticides => 'Defensivos';

  @override
  String get productCategorySeeds => 'Sementes';

  @override
  String get productCategoryMachinery => 'Máquinas';

  @override
  String get productCategoryIrrigation => 'Irrigação';

  @override
  String get productCategoryAnimalNutrition => 'Nutrição Animal';

  @override
  String get productCategoryPpeSafety => 'EPIs';

  @override
  String get productCategoryVeterinary => 'Veterinário';

  @override
  String get productCategoryOther => 'Outros';

  @override
  String get kycDocTypeFront => 'Identidade (Frente)';

  @override
  String get kycDocTypeBack => 'Identidade (Verso)';

  @override
  String get kycDocTypeAddress => 'Comprovante de Endereço';

  @override
  String get kycDocTypeRural => 'Doc. Produtor Rural';

  @override
  String validatorRequired(String field) {
    return '$field é obrigatório';
  }

  @override
  String get validatorFieldDefault => 'Campo';

  @override
  String get validatorEmailRequired => 'Email é obrigatório';

  @override
  String get validatorEmailInvalid => 'Email inválido';

  @override
  String get validatorPasswordRequired => 'Senha é obrigatória';

  @override
  String get validatorPasswordMinLength =>
      'Senha deve ter ao menos 8 caracteres';

  @override
  String get validatorCpfRequired => 'CPF é obrigatório';

  @override
  String get validatorCpfInvalid => 'CPF inválido';

  @override
  String get validatorCnpjRequired => 'CNPJ é obrigatório';

  @override
  String get validatorCnpjInvalid => 'CNPJ inválido';

  @override
  String get validatorFederalTaxIdRequired => 'CPF/CNPJ é obrigatório';

  @override
  String get validatorFederalTaxIdInvalid => 'CPF/CNPJ inválido';

  @override
  String get validatorPhoneRequired => 'Telefone é obrigatório';

  @override
  String get validatorPhoneInvalid => 'Telefone inválido';

  @override
  String get validatorNcmRequired => 'NCM é obrigatório';

  @override
  String get validatorNcmInvalid => 'NCM deve ter 8 dígitos';

  @override
  String validatorMinLength(String field, int min) {
    return '$field deve ter ao menos $min caracteres';
  }

  @override
  String validatorMaxLength(String field, int max) {
    return '$field deve ter no máximo $max caracteres';
  }

  @override
  String get validatorDisputeReasonRequired => 'Motivo é obrigatório';

  @override
  String get validatorDisputeReasonMinLength =>
      'Descreva o problema com ao menos 20 caracteres';

  @override
  String get timeAgoNow => 'Agora';

  @override
  String timeAgoMinutes(int minutes) {
    return 'Há ${minutes}min';
  }

  @override
  String timeAgoHours(int hours) {
    return 'Há ${hours}h';
  }

  @override
  String timeAgoDays(int days) {
    return 'Há ${days}d';
  }

  @override
  String badgeNcm(String code) {
    return 'NCM $code';
  }

  @override
  String get badgeRuralCredit => 'Crédito Rural';

  @override
  String get editProfilePropertyName => 'Nome da propriedade';

  @override
  String get errorCheckConnection => 'Verifique sua conexão e tente novamente';

  @override
  String get notificationsEmpty => 'Tudo certo!';

  @override
  String get notificationsEmptyHint => 'Você não tem novas notificações';

  @override
  String get notificationsOlder => 'Mais antigas';

  @override
  String get notificationsOrders => 'Pedidos';

  @override
  String get notificationsQuotes => 'Cotações';

  @override
  String get notificationsSystem => 'Sistema';

  @override
  String get notificationsThisWeek => 'Esta semana';

  @override
  String get notificationsToday => 'Hoje';

  @override
  String get orderDetailCreatedAt => 'Criado';

  @override
  String get orderDetailDelivered => 'Entregue';

  @override
  String get orderDetailDisputeHint => 'Descreva o problema com seu pedido';

  @override
  String get orderDetailFreight => 'Frete';

  @override
  String get orderDetailItems => 'Itens';

  @override
  String get orderDetailPaymentConfirmed => 'Pagamento confirmado';

  @override
  String get orderDetailShipped => 'Enviado';

  @override
  String get orderDetailStatus => 'Status';

  @override
  String get orderDetailSubmitDispute => 'Enviar disputa';

  @override
  String get orderDetailSubtotal => 'Subtotal';

  @override
  String get orderDetailSummary => 'Resumo';

  @override
  String get orderDetailTaxes => 'Impostos';

  @override
  String get orderDetailTotal => 'Total';

  @override
  String get ordersEmpty => 'Nenhum pedido ainda';

  @override
  String get ordersTabCancelled => 'Cancelados';

  @override
  String get ordersTabInProgress => 'Em andamento';

  @override
  String get paymentBarcodeCopied => 'Código de barras copiado!';

  @override
  String get paymentCopyBarcode => 'Copiar código de barras';

  @override
  String get paymentDueDate => 'Data de vencimento';

  @override
  String get paymentExpiresIn => 'Expira em';

  @override
  String get paymentTitle => 'Pagamento';

  @override
  String get paymentViaBoleto => 'Pagar via Boleto';

  @override
  String get privacyDeleteAccountButton => 'Excluir conta';

  @override
  String get privacyMarketing => 'Marketing';

  @override
  String get productDetailDefaultDescription => 'Descrição não disponível';

  @override
  String get productDetailRegionalDemandIndex => 'Índice de demanda regional';

  @override
  String get productDetailRetry => 'Tentar novamente';

  @override
  String get productDetailTechnicalInfo => 'Informações técnicas';

  @override
  String get productDetailWarrantyDescription =>
      'Produto coberto pela garantia do fabricante';

  @override
  String get productDetailWarrantyTitle => 'Garantia';

  @override
  String get productSearchAvailableProducts => 'Produtos disponíveis';

  @override
  String get productSearchDefaultUnit => 'un';

  @override
  String get productSearchEmpty => 'Nenhum produto encontrado';

  @override
  String get productSearchEmptyHint => 'Tente ajustar sua busca ou filtros';

  @override
  String get productSearchHeroTitle =>
      'Encontre os melhores produtos agrícolas';

  @override
  String get productSearchLoadError => 'Erro ao carregar produtos';

  @override
  String get productSearchPriceOnRequest => 'Preço sob consulta';

  @override
  String get productSearchRetry => 'Tentar novamente';

  @override
  String get productSearchRuralCreditLabel => 'Aceita crédito rural';

  @override
  String get profileCancel => 'Cancelar';

  @override
  String get profileConfirm => 'Confirmar';

  @override
  String get profilePrivacy => 'Privacidade';

  @override
  String get proposalComparisonBestPrice => 'Melhor preço';

  @override
  String get proposalComparisonDeliveryTime => 'Prazo de entrega';

  @override
  String get proposalComparisonEstimatedSavingsGeneric =>
      'Compare propostas para encontrar economia';

  @override
  String get proposalComparisonFreight => 'Frete';

  @override
  String get proposalComparisonSelect => 'Selecionar';

  @override
  String get proposalComparisonTotalPrice => 'Preço total';

  @override
  String get proposalDetailAccept => 'Aceitar';

  @override
  String get proposalDetailAcceptSuccess => 'Proposta aceita com sucesso!';

  @override
  String get proposalDetailCancel => 'Cancelar';

  @override
  String get proposalDetailConfirm => 'Confirmar';

  @override
  String get proposalDetailConfirmAccept => 'Confirmar aceitação?';

  @override
  String get proposalDetailFreeShipping => 'Frete grátis';

  @override
  String get proposalDetailObservations => 'Observações';

  @override
  String get proposalDetailSubtotal => 'Subtotal';

  @override
  String get proposalDetailTaxes => 'Impostos';

  @override
  String get proposalDetailTotal => 'Total';

  @override
  String get quoteBuilderDeliveryAddress => 'Endereço de entrega';

  @override
  String get quoteBuilderPaymentCondition => 'Condição de pagamento';

  @override
  String get quoteBuilderSubmit => 'Enviar cotação';

  @override
  String get quoteDetailCompareProposals => 'Comparar propostas';

  @override
  String get quoteDetailExpiration => 'Validade';

  @override
  String get quoteDetailItems => 'Itens';

  @override
  String get recurringQuotesNew => 'Nova cotação recorrente';

  @override
  String get recurringQuotesProductLabel => 'Produto';

  @override
  String get recurringQuotesQuantityLabel => 'Quantidade';

  @override
  String get settingsNotifications => 'Notificações';

  @override
  String get settingsOrderAlerts => 'Alertas de pedidos';

  @override
  String get settingsQuoteAlerts => 'Alertas de cotações';

  @override
  String get paymentCopyPixKey => 'Copiar chave PIX';

  @override
  String get paymentPixKeyCopied => 'Chave PIX copiada!';

  @override
  String get quoteBuilderSuccess => 'Cotação enviada com sucesso!';

  @override
  String myQuotesItemCount(int count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count itens',
      one: '1 item',
    );
    return '$_temp0';
  }

  @override
  String proposalComparisonDays(int count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count dias',
      one: '1 dia',
    );
    return '$_temp0';
  }

  @override
  String proposalComparisonEstimatedSavings(String value) {
    return 'Economia estimada: $value';
  }

  @override
  String proposalDetailBusinessDays(int count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count dias úteis',
      one: '1 dia útil',
    );
    return '$_temp0';
  }

  @override
  String quoteBuilderItemCount(int count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count itens',
      one: '1 item',
    );
    return '$_temp0';
  }

  @override
  String get geoTitle => 'Localização Inteligente';

  @override
  String get geoAllow => 'Permitir Localização';

  @override
  String get geoSkip => 'Agora não';

  @override
  String get geoPrivacy => 'PRIVACIDADE PROTEGIDA';

  @override
  String get geoDescPart1 => 'Para que a ';

  @override
  String get geoDescHighlight1 => 'iFarm';

  @override
  String get geoDescPart2 =>
      ' encontre os melhores fornecedores próximos a você e calcule o frete com ';

  @override
  String get geoDescHighlight2 => 'precisão cirúrgica';

  @override
  String get geoDescPart3 => ', precisamos da sua localização.';
}
