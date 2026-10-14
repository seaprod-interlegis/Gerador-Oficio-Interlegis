const { jsPDF } = window.jspdf;

function addResponsavel() {
  const container = document.getElementById("containerResponsaveis");
  const novoFilho = container.children[0].cloneNode(true);
  
  novoFilho.querySelectorAll('input').forEach(input => input.value = '');
  
  const select = novoFilho.querySelector('.rep-vinculo');
  if (select) {
      select.disabled = false;
      const temTerceirizado = Array.from(select.options).some(opt => opt.value === "(x) Terceirizado");
      if (!temTerceirizado) {
          const optTerceirizado = document.createElement('option');
          optTerceirizado.value = "(x) Terceirizado";
          optTerceirizado.text = "Terceirizado";
          select.appendChild(optTerceirizado);
      }
  }

  const btnRemove = novoFilho.querySelector('.btn-remove');
  if (btnRemove) {
      btnRemove.style.display = 'inline-block';
  }

  container.appendChild(novoFilho);
}

function removerResponsavel(botao) {
  const container = document.getElementById("containerResponsaveis");
  const totalResponsaveis = container.getElementsByClassName("responsavel-entry").length;
  
  if (totalResponsaveis > 1) {
    botao.closest(".responsavel-entry").remove();
  } else {
    alert("É necessário manter pelo menos um formulário de responsável técnico.");
  }
}

function verificarDesativacaoObrigatoria() {
  const checkDeleg = document.getElementById("checkDeleg") && document.getElementById("checkDeleg").checked;
  const delegSim = document.querySelector('input[name="possuiProdutosDeleg"][value="sim"]')?.checked;
  const precisaPorDelegacao = checkDeleg && delegSim;

  const checkDnsDom = document.getElementById("checkDNSDominio") && document.getElementById("checkDNSDominio").checked;
  const dnsSim = document.querySelector('input[name="possuiPortalDns"][value="sim"]')?.checked;
  const precisaPorDns = checkDnsDom && dnsSim;

  const obrigarDesativacao = precisaPorDelegacao || precisaPorDns;

  const checkDesat = document.getElementById('checkDesat');
  const secDesat = document.getElementById('secDesat');
  const camposDesat = secDesat.querySelectorAll('input, select');

  const avisoDeleg = document.getElementById('avisoDelegProdutos');
  const avisoDns = document.getElementById('avisoDnsPortal');

  if (avisoDeleg) avisoDeleg.style.display = precisaPorDelegacao ? 'block' : 'none';
  if (avisoDns) avisoDns.style.display = precisaPorDns ? 'block' : 'none';

  if (obrigarDesativacao) {
      checkDesat.checked = true;
      secDesat.style.display = 'block';
      camposDesat.forEach(campo => campo.required = true);
  } else {
      secDesat.style.display = checkDesat.checked ? 'block' : 'none';
      camposDesat.forEach(campo => campo.required = checkDesat.checked);
  }
}

function toggleSecao(checkboxId, containerId) {
    const checkbox = document.getElementById(checkboxId);
    const container = document.getElementById(containerId);
    
    if (checkbox && container) {
        const estaMarcado = checkbox.checked;
        
        // NOVA TRAVA DE SEGURANÇA: Impedir de desmarcar o item 3 se for obrigatório
        if (!estaMarcado && checkboxId === "checkDesat") {
            const checkDeleg = document.getElementById("checkDeleg")?.checked;
            const delegSim = document.querySelector('input[name="possuiProdutosDeleg"][value="sim"]')?.checked;
            
            const checkDnsDom = document.getElementById("checkDNSDominio")?.checked;
            const dnsSim = document.querySelector('input[name="possuiPortalDns"][value="sim"]')?.checked;
            
            if ((checkDeleg && delegSim) || (checkDnsDom && dnsSim)) {
                alert("A desativação (Item 3) é obrigatória devido às opções selecionadas na seção 4.");
                checkbox.checked = true; 
                return; 
            }
        }
        
        container.style.display = estaMarcado ? "block" : "none";
        
        const campos = container.querySelectorAll('input, select');
        campos.forEach(campo => {
            campo.required = estaMarcado;
        });

        if (checkboxId === "checkDeleg" || checkboxId === "checkDNSDominio") {
            verificarDesativacaoObrigatoria();
        }
    }
}

document.getElementById("meuFormulario").addEventListener("submit", function (event) {
  event.preventDefault();

  // --- NOVA TRAVA DE SUBMIT ---
  const checkDeleg = document.getElementById("checkDeleg")?.checked;
  const radioSimDeleg = document.querySelector('input[name="possuiProdutosDeleg"][value="sim"]')?.checked;
  const delegacaoComProdutos = checkDeleg && radioSimDeleg;

  const checkDnsDom = document.getElementById("checkDNSDominio")?.checked;
  const radioSimDns = document.querySelector('input[name="possuiPortalDns"][value="sim"]')?.checked;
  const dnsComPortal = checkDnsDom && radioSimDns;

  const checkDesat = document.getElementById("checkDesat")?.checked;
  const valProdDesat = document.getElementById("prodDesat").value.trim();
  const valJustDesat = document.getElementById("justDesat").value.trim();

  if (delegacaoComProdutos || dnsComPortal) {
      if (!checkDesat || valProdDesat === "" || valJustDesat === "") {
          alert("ATENÇÃO: Como você confirmou possuir produtos ativos na Delegação ou Portal Modelo no Reapontamento, é OBRIGATÓRIO preencher o 'Produto(s)' e a 'Justificativa' na seção '3) Solicitação de desativação'.");
          document.getElementById("checkDesat").scrollIntoView({ behavior: 'smooth', block: 'center' });
          return; 
      }
  }
  // --- FIM DA NOVA TRAVA ---

  const brasaoInput = document.getElementById("brasao");

  const tipoCasa = document.getElementById("tipoCasa").value || "_______________";
  const municipio = document.getElementById("municipioCasa").value || "_______________";
  const estado = document.getElementById("estadoCasa").value || "___";

  let nomeConstruido = `${tipoCasa} de ${municipio} - ${estado}`;
  if (tipoCasa === "Assembleia Legislativa") {
      nomeConstruido = `Assembleia Legislativa do Estado de ${estado}`;
  }

  const checkExc = document.getElementById("checkExcResp") && document.getElementById("checkExcResp").checked;
  const valExcNome = checkExc && document.getElementById("exclusaoNome").value ? document.getElementById("exclusaoNome").value : "____________________________________";
  const valExcJust = checkExc && document.getElementById("exclusaoJust").value ? document.getElementById("exclusaoJust").value : "____________________________________";

  const dados = {
    nomeCasa: nomeConstruido,
    poderLegislativo: tipoCasa === "Assembleia Legislativa" ? "Poder Legislativo Estadual" : "Poder Legislativo Municipal",
    cnpj: document.getElementById("cnpjCasa").value || "00.000.000/0001-01",
    cidade: `${municipio} - ${estado}`,
    telefoneCasa: document.getElementById("telefoneCasa").value || "_____________",
    emailCasa: document.getElementById("emailCasa").value || "_____________",
    nomePres: document.getElementById("nomePresidente").value || "________________",
    telPres: document.getElementById("contatoPresidente").value || "_____________",
    emailPres: document.getElementById("emailPresidente").value || "_____________",
    mandato: document.getElementById("mandatoPresidente").value || "2025-2028",
    
    endereco: document.getElementById("endCasaRodape").value || "Praça SAPL, nº 123, Centro, Sapelópolis, DF",
    cep: document.getElementById("cepRodape").value || "70.000-123",
    siteRodape: document.getElementById("siteRodape").value || "sapelopolis.leg.br",
    
    excNome: valExcNome,
    excJust: valExcJust,
    
    c2_Leg: document.getElementById("checkLeg").checked ? "[x]" : "[ ]",
    c2_Portal: document.getElementById("checkPortal").checked ? "[x]" : "[ ]",
    c2_Sapl: document.getElementById("checkSapl").checked ? "[x]" : "[ ]",
    
    c3_Desat: document.getElementById("checkDesat").checked ? "[x]" : "[ ]",
    c3_Prod: document.getElementById("prodDesat").value || "_________________",
    c3_Just: document.getElementById("justDesat").value || "______________________________________________________",
    
    c4_Hosp: document.getElementById("checkHosp").checked ? "[x]" : "[ ]",
    c4_Deleg: document.getElementById("checkDeleg").checked ? "[x]" : "[ ]",
    c4_Ds1: document.getElementById("dnsDs1").value || "__________________________________________________",
    c4_Ds2: document.getElementById("dnsDs2").value || "__________________________________________________",
    c4_DnsSec: document.getElementById("dnsSec").value || "_________________________________________________",
    
    cDnsDom: document.getElementById("checkDNSDominio").checked ? "[x]" : "[ ]",
    regA: document.getElementById("regA").value || "__________________________________________________",
    cname: document.getElementById("cname").value || "__________________________________________________",
    cDnsEmail: document.getElementById("checkDNSEmail").checked ? "[x]" : "[ ]",
    emRegA: document.getElementById("emailRegA").value || "__________________________________________________",
    regMx: document.getElementById("regMx").value || "__________________________________________________",
    spf: document.getElementById("txtSpf").value || "__________________________________________________",
    dkim: document.getElementById("txtDkim").value || "__________________________________________________",
    
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
      pdf.text(dados.poderLegislativo, 45, y + 13);
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
    
    let textoInicio = "";
    if (tipoCasa === "Assembleia Legislativa") {
      textoInicio = `A Assembleia Legislativa do Estado de(o/a) ${estado}`;
    } else {
      textoInicio = `A Câmara Municipal de(o/a) ${municipio}`;
    }

    const intro = `${textoInicio}, com contatos institucionais de telefone ${dados.telefoneCasa} e e-mail ${dados.emailCasa}, sob a presidência do(a) Sr(a). ${dados.nomePres}, contato ${dados.telPres} e e-mail ${dados.emailPres}, realiza a solicitação a seguir referente aos produtos e serviços do Programa Interlegis.`;
    
    pdf.text(intro, margem + 5, y, { maxWidth: 165, align: "justify" });
    
    y += 20;
    pdf.setFont("times", "bold");
    pdf.text("1) Designação de Responsáveis Técnicos desta Casa:", margem, y);
    
    let rows = [];

    if (document.getElementById("checkAddResp") && document.getElementById("checkAddResp").checked) {
      rows = Array.from(document.querySelectorAll(".responsavel-entry")).map(el => [
        el.querySelector(".rep-nome") ? el.querySelector(".rep-nome").value : '',
        el.querySelector(".rep-cpf") ? el.querySelector(".rep-cpf").value : '',
        el.querySelector(".rep-email") ? el.querySelector(".rep-email").value : '',
        el.querySelector(".rep-tel") ? el.querySelector(".rep-tel").value : '',
        el.querySelector(".rep-vinculo") ? el.querySelector(".rep-vinculo").value : ''
      ]);
    } else {
      rows = [['', '', '', '', '']];
    }

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
    pdf.text(`${dados.c4_Deleg} Delegação¹ do domínio LEG.BR para hospedagem em provedor externo`, margem + 5, y);
    
    y += 6;
    pdf.text("Dados necessários:", margem + 10, y);
    y += 6;
    pdf.text(`DS1: ${dados.c4_Ds1}`, margem + 10, y);
    y += 6;
    pdf.text(`DS2: ${dados.c4_Ds2}`, margem + 10, y);
    y += 6;
    const rawDnsSec = `DNSSEC²: ${dados.c4_DnsSec}`;
    const linhasDnsSec = rawDnsSec.match(/.{1,60}/g) || [rawDnsSec];
    pdf.text(linhasDnsSec, margem + 10, y);
    y += (linhasDnsSec.length - 1) * 5;

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
    pdf.text("Dados necessários:", margem + 5, y);
    y += 6;
    pdf.text(`Registro A (endereço IP): ${dados.regA}`, margem + 5, y);
    y += 6;
    pdf.text(`CNAME: ${dados.cname}`, margem + 5, y);

    y += 15;
    pdf.setFontSize(10);
    pdf.setFont("times", "bold");
    pdf.text(`${dados.cDnsEmail} Reapontamento de DNS do E-MAIL para nova hospedagem externa`, margem, y);
    y += 6;
    pdf.setFont("times", "normal");
    pdf.text("Dados necessários:", margem + 5, y);
    
    y += 6;
    pdf.text(`Registro A (endereço IP): ${dados.emRegA}`, margem + 5, y);
    y += 6;
    pdf.text(`Registro MX: ${dados.regMx}`, margem + 5, y);
    y += 6;
    pdf.text(`TXT SPF: ${dados.spf}`, margem + 5, y);
    y += 6;
    
    const rawDkim = `TXT DKIM: ${dados.dkim}`;
    const linhasDkim = rawDkim.match(/.{1,75}/g) || [rawDkim];

    linhasDkim.forEach((linha) => {
        if (y > 250) { 
            pdf.line(margem, 280, 190, 280);
            pdf.setFontSize(8);
            pdf.setFont("times", "normal");
            pdf.text(pdf.splitTextToSize(rodapeFormatado, 170), 105, 284, { align: 'center' });

            pdf.addPage();
            y = 15;
            cabecalho();
            y += 40; 
            pdf.setFontSize(10);
            pdf.setFont("times", "normal");
        }
        pdf.text(linha, margem + 5, y);
        y += 5;
    });
    
    y += 8;
    pdf.setFontSize(8);
    pdf.text("Acesso à Interface de gerência: correioadm.municipio.uf.leg.br | Conta: usuário@municipio.uf.leg.br", margem + 5, y);
    
    y += 15;

    if (y > 220) {
        pdf.setFontSize(7);
        pdf.text("3. Será desativado o Portal Modelo, enquanto os outros produtos serão mantidos.", margem, 268);
        const txtRodapeAtual = "4. Será desativado o serviço de e-mail oferecido pelo Interlegis de forma definitiva, ou seja, não poderá ser recuperado, mas poderá ser mantido o domínio .leg.br nos endereços dos e-mails.";
        pdf.text(pdf.splitTextToSize(txtRodapeAtual, 170), margem, 272);
        pdf.line(margem, 280, 190, 280);
        pdf.setFontSize(8);
        pdf.text(pdf.splitTextToSize(rodapeFormatado, 170), 105, 284, { align: 'center' });
        
        pdf.addPage();
        y = 15;
        cabecalho();
        y += 40;
    }

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

    if (y > 190) {
        pdf.setFontSize(7);
        pdf.text("3. Será desativado o Portal Modelo, enquanto os outros produtos serão mantidos.", margem, 268);
        const txtRodapeAtual = "4. Será desativado o serviço de e-mail oferecido pelo Interlegis de forma definitiva, ou seja, não poderá ser recuperado, mas poderá ser mantido o domínio .leg.br nos endereços dos e-mails.";
        pdf.text(pdf.splitTextToSize(txtRodapeAtual, 170), margem, 272);
        pdf.line(margem, 280, 190, 280);
        pdf.setFontSize(8);
        pdf.text(pdf.splitTextToSize(rodapeFormatado, 170), 105, 284, { align: 'center' });
        
        pdf.addPage();
        y = 15;
        cabecalho();
        y += 40;
        pdf.setFont("times", "normal");
        pdf.setFontSize(10);
    }

    // --- BLOCO DE ASSINATURA ---
    y += 15;
    pdf.text("Atenciosamente,", margem, y); 
    y += 30; 
    pdf.line(65, y, 145, y); 
    pdf.setFont("times", "bold");
    pdf.text(dados.nomePres, 105, y + 5, { align: 'center' }); 
    pdf.setFont("times", "normal");
    pdf.text("Presidente", 105, y + 10, { align: 'center' });
    pdf.text(dados.mandato, 105, y + 15, { align: 'center' });

    // --- RODAPÉ ÚLTIMA PÁGINA  ---
    pdf.setFontSize(7);
    pdf.text("3. Será desativado o Portal Modelo, enquanto os outros produtos serão mantidos.", margem, 268);
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