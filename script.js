const { jsPDF } = window.jspdf;

function addResponsavel() {
  const container = document.getElementById("containerResponsaveis");
  const novoFilho = container.children[0].cloneNode(true);
  novoFilho.querySelectorAll('input').forEach(input => input.value = '');
  container.appendChild(novoFilho);
}

document.getElementById("meuFormulario").addEventListener("submit", function (event) {
  event.preventDefault();
  const brasaoInput = document.getElementById("brasao");

  const dados = {
    nomeCasa: document.getElementById("nomeCasa").value || "________________",
    cnpj: document.getElementById("cnpjCasa").value || "00.000.000/0001-01",
    cidade: document.getElementById("cidadeCasa").value || "_____________",
    telefoneCasa: document.getElementById("telefoneCasa").value || "_____________",
    emailCasa: document.getElementById("emailCasa").value || "_____________",
    nomePres: document.getElementById("nomePresidente").value || "________________",
    telPres: document.getElementById("contatoPresidente").value || "_____________",
    emailPres: document.getElementById("emailPresidente").value || "_____________",
    mandato: document.getElementById("mandatoPresidente").value || "2025-2028",
    
    endereco: document.getElementById("endCasaRodape").value || "Praça SAPL, nº 123, Centro, Sapelópolis, DF",
    cep: document.getElementById("cepRodape").value || "70.000-123",
    siteRodape: document.getElementById("siteRodape").value || "sapelopolis.leg.br",
    
    excNome: document.getElementById("exclusaoNome").value || "____________________________________",
    excJust: document.getElementById("exclusaoJust").value || "____________________________________",
    
    c2_Leg: document.getElementById("checkLeg").checked ? "[x]" : "[ ]",
    c2_Portal: document.getElementById("checkPortal").checked ? "[x]" : "[ ]",
    c2_Sapl: document.getElementById("checkSapl").checked ? "[x]" : "[ ]",
    
    c3_Desat: document.getElementById("checkDesat").checked ? "[x]" : "[ ]",
    c3_Prod: document.getElementById("prodDesat").value || "_________________",
    c3_Just: document.getElementById("justDesat").value || "______________________________________________________",
    
    c4_Hosp: document.getElementById("checkHosp").checked ? "[x]" : "[ ]",
    c4_Deleg: document.getElementById("checkDeleg").checked ? "[x]" : "[ ]",
    c4_Ds1: document.getElementById("dnsDs1").value || "______________________________________",
    c4_Ds2: document.getElementById("dnsDs2").value || "______________________________________",
    c4_DnsSec: document.getElementById("dnsSec").value || "_____________________________________________________",
    
    cDnsDom: document.getElementById("checkDNSDominio").checked ? "[x]" : "[ ]",
    regA: document.getElementById("regA").value || "___________________________________",
    cname: document.getElementById("cname").value || "___________________________________",
    cDnsEmail: document.getElementById("checkDNSEmail").checked ? "[x]" : "[ ]",
    emRegA: document.getElementById("emailRegA").value || "___________________________________",
    regMx: document.getElementById("regMx").value || "___________________________________",
    spf: document.getElementById("txtSpf").value || "___________________________________",
    dkim: document.getElementById("txtDkim").value || "___________________________________",
    
    c5_Back: document.getElementById("checkBack").checked ? "[x]" : "[ ]",
    c5_Prod: document.getElementById("backProd").value || "______________________",
    c5_Data: document.getElementById("backData").value || "___/___/______",
    c5_Just: document.getElementById("backJust").value || "___________________________________________________________________"
  };

  const rodapeFormatado = `${dados.endereco}\nCEP ${dados.cep} | Telefones: ${dados.telefoneCasa} | ${dados.siteRodape}`;

  function gerarPDF(brasaoBase64) {
    const pdf = new jsPDF();
    const margem = 20;
    let y = 15;

    const cabecalho = () => {
      if (brasaoBase64) pdf.addImage(brasaoBase64, "PNG", 20, y, 22, 22);
      pdf.setFont("times", "bold");
      pdf.setFontSize(11);
      pdf.text(dados.nomeCasa.toUpperCase(), 45, y + 8);
      pdf.text("Poder Legislativo Municipal", 45, y + 13);
      pdf.setFontSize(9);
      pdf.text(`CNPJ nº ${dados.cnpj}`, 45, y + 18);
    };

    // --- PÁGINA 1 ---
    cabecalho();
    pdf.setFont("times", "normal");
    pdf.setFontSize(10);
    pdf.text(`${dados.cidade}, ${new Date().toLocaleDateString('pt-BR')}`, 190, y + 35, { align: 'right' });
    
    y += 45;
    pdf.setFont("times", "bold");
    pdf.text("Ilmo. Sr. NILO AMARO BAIRROS DOS SANTOS", margem, y);
    pdf.setFont("times", "normal");
    pdf.text("Diretor-Executivo do Instituto Legislativo Brasileiro (ILB)\nPrograma Interlegis - ILB - Senado Federal", margem, y + 5);

    y += 15;
    pdf.setFont("times", "bold");
    pdf.text("Assunto: Ofício de Solicitação referente aos Produtos e Serviços do Programa Interlegis", margem, y);

    y += 10;
    pdf.setFont("times", "normal");
    const intro = `A Câmara Municipal de ${dados.nomeCasa}, com contatos institucionais de telefone ${dados.telefoneCasa} e e-mail ${dados.emailCasa}, sob a presidência do(a) Sr(a). ${dados.nomePres}, contato ${dados.telPres} e e-mail ${dados.emailPres}, realiza a solicitação a seguir referente aos produtos e serviços do Programa Interlegis.`;
    pdf.text(intro, margem + 5, y, { maxWidth: 165, align: "justify" });
    
    y += 20;
    pdf.setFont("times", "bold");
    pdf.text("1) Designação de Responsáveis Técnicos desta Casa:", margem, y);
    
    const rows = Array.from(document.querySelectorAll(".responsavel-entry")).map(el => [
      el.querySelector(".rep-nome").value,
      el.querySelector(".rep-cpf").value,
      el.querySelector(".rep-email").value,
      el.querySelector(".rep-tel").value,
      el.querySelector(".rep-vinculo").value
    ]);

    pdf.autoTable({
      startY: y + 2,
      margin: { left: margem },
      head: [['Nome completo', 'CPF', 'E-mail', 'Telefone/WhatsApp', 'Vínculo']],
      body: rows,
      theme: 'grid',
      styles: { font: "times", fontSize: 8 },
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' }
    });

    y = pdf.lastAutoTable.finalY + 8;
    pdf.setFont("times", "normal");
    pdf.text(`Para a exclusão de responsável técnico, informar nome(s) completo(s): ${dados.excNome}`, margem, y);
    y += 6;
    pdf.text(`Justificativa obrigatória da exclusão: ${dados.excJust}`, margem, y);

    y += 12;
    pdf.setFont("times", "bold");
    pdf.text("2) Solicitação de implementação de Produto(s)", margem, y);
    pdf.setFont("times", "normal");
    y += 7;
    pdf.text(`${dados.c2_Leg} Domínio .LEG.BR (único produto que não exige ACT)\n${dados.c2_Portal} Portal Modelo (formato www.municipio.uf.leg.br)\n${dados.c2_Sapl} Sistema de Apoio ao Processo Legislativo - SAPL (formato sapl.municipio.uf.leg.br)`, margem + 5, y);

    y += 18;
    pdf.setFont("times", "bold");
    pdf.text("3) Solicitação de desativação de Produto(s)", margem, y);
    pdf.setFont("times", "normal");
    y += 6;
    pdf.text(`${dados.c3_Desat} Autorizo desativar o(s) Produto(s) ${dados.c3_Prod}, atualmente instalado(s) no datacenter do Senado Federal.`, margem + 5, y);
    y += 6;
    pdf.text(`Justificativa obrigatória: ${dados.c3_Just}`, margem + 5, y);

    y += 12;
    pdf.setFont("times", "bold");
    pdf.text("4) Solicitação de Serviço(s)", margem, y);
    pdf.setFont("times", "normal");
    y += 6;
    pdf.text(`${dados.c4_Hosp} Hospedagem do domínio LEG.BR no datacenter do Senado Federal`, margem + 5, y);
    y += 6;
    pdf.text(`${dados.c4_Deleg} Delegação¹ do domínio LEG.BR para hospedagem em provedor externo (único serviço que não exige ACT)`, margem + 5, y);
    y += 6;
    pdf.text(`Dados necessários:\nDS1: ${dados.c4_Ds1} DS2: ${dados.c4_Ds2}\nDNSSEC²: ${dados.c4_DnsSec}`, margem + 10, y);

    // --- RODAPÉ PÁGINA 1 ---
    pdf.setFontSize(7);
    const t1 = "1. Na delegação do domínio, todos os produtos/serviços ativos no datacenter do Senado Federal serão automaticamente DESATIVADOS. Por isso, é preciso preencher também o item 3 deste ofício.";
    pdf.text(pdf.splitTextToSize(t1, 170), margem, 264);
    const t2 = "2. Conforme exigência do Registro.br, o Servidor que hospedará o domínio deverá estar habilitado com DNSSEC (Domain Name System Security Extensions - Extensões de Segurança do Sistema de Nomes de Domínio), para a segurança do protocolo DNS (Sistema de Nomes de Domínio).";
    pdf.text(pdf.splitTextToSize(t2, 170), margem, 271);
    pdf.line(margem, 280, 190, 280);
    pdf.setFontSize(8);
    pdf.text(pdf.splitTextToSize(rodapeFormatado, 170), 105, 284, { align: 'center' });

    // --- PÁGINA 2 ---
    pdf.addPage();
    y = 15;
    cabecalho();
    y += 40;

    pdf.setFontSize(10);
    pdf.setFont("times", "bold");
    pdf.text(`${dados.cDnsDom} Reapontamento de DNS do domínio LEG.BR para nova hospedagem externa³`, margem, y);
    y += 6;
    pdf.setFont("times", "normal");
    pdf.text(`Dados necessários:\nRegistro A (endereço IP): ${dados.regA}\nCNAME: ${dados.cname}`, margem + 5, y);

    y += 15;
    pdf.setFontSize(10);
    pdf.setFont("times", "bold");
    pdf.text(`${dados.cDnsEmail} Reapontamento de DNS do E-MAIL para nova hospedagem externa`, margem, y);
    y += 6;
    pdf.setFont("times", "normal");
    pdf.text("Dados necessários:", margem + 5, y);
    y += 6;
    pdf.text(`Registro A (endereço IP): ${dados.emRegA}      Registro MX: ${dados.regMx}`, margem + 5, y);
    y += 6;
    pdf.text(`TXT SPF: ${dados.spf}      TXT DKIM: ${dados.dkim}`, margem + 5, y);
    y += 8;
    pdf.setFontSize(8);
    pdf.text("Acesso à Interface de gerência: correioadm.municipio.uf.leg.br | Conta: usuário@municipio.uf.leg.br", margem + 5, y);
    
    y += 15;
    pdf.setFontSize(10);
    pdf.setFont("times", "bold");
    pdf.text("5) Restauração de dados - Backup", margem, y);
    pdf.setFont("times", "normal");
    y += 6;
    const txtBackup = `${dados.c5_Back} Autorizo a retroação dos dados referentes ao produto ${dados.c5_Prod}, para que sejam restaurados conforme a posição vigente na data de ${dados.c5_Data}. Consinto expressamente que todo e qualquer conteúdo eventualmente inserido após essa data seja descartado, considerando-se inválido para fins de registro ou continuidade do processamento das informações. Estou ciente de que a restauração é irreversível e o conteúdo posterior à data indicada não poderá ser recuperado.`;
    pdf.text(txtBackup, margem + 5, y, { maxWidth: 165, align: "justify" });
    
    const dimBack = pdf.getTextDimensions(txtBackup, { maxWidth: 165 });
    y += dimBack.h + 5;
    pdf.text(`Justificativa obrigatória: ${dados.c5_Just}`, margem + 5, y);

    y += 15;
    pdf.text("Atenciosamente,", margem, y); 
    y += 25;
    pdf.line(65, y, 145, y); 
    pdf.setFont("times", "bold");
    pdf.text(dados.nomePres, 105, y + 5, { align: 'center' }); 
    pdf.setFont("times", "normal");
    pdf.text("Presidente", 105, y + 10, { align: 'center' });
    pdf.text(dados.mandato, 105, y + 15, { align: 'center' });

    // --- RODAPÉ PÁGINA 2 ---
    pdf.setFontSize(7);
    pdf.text(pdf.splitTextToSize("3. Será desativado o Portal Modelo, enquanto os outros produtos serão mantidos.", 170), margem, 268);
    const t4 = "4. Será desativado o serviço de e-mail oferecido pelo Interlegis de forma definitiva, ou seja, não poderá ser recuperado, mas poderá ser mantido o domínio .leg.br nos endereços dos e-mails.";
    pdf.text(pdf.splitTextToSize(t4, 170), margem, 272); 
    pdf.line(margem, 280, 190, 280);
    pdf.setFontSize(8);
    pdf.text(pdf.splitTextToSize(rodapeFormatado, 170), 105, 284, { align: 'center' });

    pdf.save("oficio_interlegis.pdf");
  }

  if (brasaoInput.files && brasaoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = e => gerarPDF(e.target.result);
    reader.readAsDataURL(brasaoInput.files[0]);
  } else {
    gerarPDF(null);
  }
});