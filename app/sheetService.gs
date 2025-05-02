function extrairTodasAsSemanasUnificadas() {
  const semanas = ["Semana 1", "Semana 2", "Semana 3"];
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  const abaDestinoNome = "Escala Completa";

  let abaDestino = planilha.getSheetByName(abaDestinoNome);
  if (abaDestino) {
    abaDestino.clear();
  } else {
    abaDestino = planilha.insertSheet(abaDestinoNome);
  }

  abaDestino.appendRow(["Semana", "Unidade", "Turma", "Dia", "Horário", "Monitor"]);

  semanas.forEach(semana => {
    extrairEscalaUnificada(semana, abaDestino);
  });

  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert("✅ Extração de todas as semanas concluída na aba 'Escala Completa'!");
}

function extrairEscalaUnificada(nomeDaSemana, abaDestino) {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  const aba = planilha.getSheetByName(nomeDaSemana);

  if (!aba) {
    Logger.log(`Aba '${nomeDaSemana}' não encontrada!`);
    return;
  }

  const totalLinhas = 300;
  const totalColunas = aba.getLastColumn();
  const dados = aba.getRange(1, 1, totalLinhas, totalColunas).getValues();

  let linhaDias = null;

  for (let i = 0; i < dados.length; i++) {
    const linha = dados[i];

    if (linha.every(cell => cell === "")) continue;

    if (linha[2] && linha[2].toString().toLowerCase().includes("segunda")) {
      linhaDias = linha.slice(2, 7).map(dia => dia.trim());
      continue;
    }

    if (linhaDias && linha[1]) {
      const horario = linha[1].toString().trim();

      for (let d = 0; d < 5; d++) {
        const celula = linha[d + 2];

        if (celula && typeof celula === 'string' && celula.includes("/OAP")) {
          const partes = celula.split("/OAP -");
          const codigo = partes[0].trim();
          let monitor = partes[1] ? partes[1].replace("*", "").trim() : "";

          const unidadeTurma = codigo.split("-");
          const unidade = unidadeTurma[0] ? unidadeTurma[0].trim() : "";
          const turma = unidadeTurma[1] ? "'" + unidadeTurma[1].trim() : "";

          const dia = linhaDias[d];

          abaDestino.appendRow([
            nomeDaSemana,
            unidade,
            turma,
            dia,
            horario,
            monitor
          ]);
        }
      }
    }
  }
}

function montarMapaEmails(abaEmails) {
  const dados = abaEmails.getDataRange().getValues();
  const mapa = {};

  for (let i = 2; i < dados.length; i++) {
    const linha = dados[i];

    // REDAÇÃO (colunas A–C)
    if (linha[0] && linha[2]) {
      const primeiroNome = linha[0].toString().trim().toLowerCase().split(" ")[0];
      mapa[primeiroNome] = linha[2].toString().trim();
    }

    // CIÊNCIAS (colunas D–F)
    if (linha[3] && linha[5]) {
      const primeiroNome = linha[3].toString().trim().toLowerCase().split(" ")[0];
      mapa[primeiroNome] = linha[5].toString().trim();
    }

    // MATEMÁTICA (colunas G–I)
    if (linha[6] && linha[8]) {
      const primeiroNome = linha[6].toString().trim().toLowerCase().split(" ")[0];
      mapa[primeiroNome] = linha[8].toString().trim();
    }
  }

  return mapa;
}

function validarEscalaComTutores() {
  const semanaAtual = descobrirSemanaAtual();
  const monitores = buscarMonitoresSemana(semanaAtual);
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  const abaEmails = planilha.getSheetByName("Tutores");

  if (!abaEmails) {
    Logger.log("❌ Aba 'Tutores' não encontrada!");
    return;
  }

  const mapaEmails = montarMapaEmails(abaEmails);

  // Pega todos os monitores escalados da semana atual
  const nomesEscalados = new Set();
  monitores.forEach(item => {
    const nome = item.monitor ? item.monitor.toLowerCase().trim().split(" ")[0] : "";
    if (nome) nomesEscalados.add(nome);
  });

  // Agora, verifica quais desses nomes não existem no mapa de e-mails
  const nomesSemEmail = [];
  nomesEscalados.forEach(nome => {
    if (!mapaEmails[nome]) {
      nomesSemEmail.push(nome);
    }
  });

  if (nomesSemEmail.length === 0) {
    Logger.log(`✅ Todos os monitores da ${semanaAtual} têm e-mails cadastrados.`);
  } else {
    Logger.log(`⚠️ Monitores da ${semanaAtual} SEM e-mail cadastrado:`);
    Logger.log(nomesSemEmail.join("\n"));
  }
}

function destacarMonitoresSemEmailNaEscala() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  const abaEscala = planilha.getSheetByName("Escala Completa");
  const abaTutores = planilha.getSheetByName("Tutores");

  if (!abaEscala || !abaTutores) {
    Logger.log("❌ Aba 'Escala Completa' ou 'Tutores' não encontrada!");
    return;
  }

  const dados = abaEscala.getDataRange().getValues();
  const mapaEmails = montarMapaEmails(abaTutores);

  // Começa da linha 2 porque linha 1 é o cabeçalho
  for (let i = 1; i < dados.length; i++) {
    const linha = dados[i];
    const nomeCompleto = linha[5];
    const primeiraColunaDoMonitor = 6; // Coluna F (índice começa em 0)

    if (nomeCompleto) {
      const nomeNormalizado = nomeCompleto.toString().trim().toLowerCase().split(" ")[0];
      const email = mapaEmails[nomeNormalizado];

      if (!email) {
        // Pinta a célula de vermelho
        abaEscala.getRange(i + 1, primeiraColunaDoMonitor + 1).setBackground("#f44336");
      } else {
        // Restaura fundo branco (caso tenha sido pintado antes)
        abaEscala.getRange(i + 1, primeiraColunaDoMonitor + 1).setBackground("#ffffff");
      }
    }
  }

  Logger.log("🎨 Células de monitores sem e-mail foram destacadas em vermelho.");
}

function validarEscalaCompletaComTutores() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  const abaEscala = planilha.getSheetByName("Escala Completa");
  const abaTutores = planilha.getSheetByName("Tutores");

  if (!abaEscala || !abaTutores) {
    Logger.log("❌ Abas necessárias não encontradas!");
    return;
  }

  const dadosEscala = abaEscala.getDataRange().getValues();
  const mapaEmails = montarMapaEmails(abaTutores);

  const nomesSemEmail = new Set();
  const colMonitor = 5; // Coluna F = monitor

  for (let i = 1; i < dadosEscala.length; i++) {
    const linha = dadosEscala[i];
    const monitor = linha[colMonitor];

    if (monitor) {
      const nome = monitor.toString().toLowerCase().trim().split(" ")[0];
      if (!mapaEmails[nome]) {
        nomesSemEmail.add(nome);
        abaEscala.getRange(i + 1, colMonitor + 1).setBackground("#f44336"); // marca vermelho
      } else {
        abaEscala.getRange(i + 1, colMonitor + 1).setBackground("#ffffff"); // limpa se estiver correto
      }
    }
  }

  if (nomesSemEmail.size > 0) {
    Logger.log("⚠️ Monitores SEM e-mail cadastrado (todas as semanas):");
    Logger.log([...nomesSemEmail].sort().join("\n"));
  } else {
    Logger.log("✅ Todos os monitores da escala completa têm e-mails cadastrados.");
  }
}

