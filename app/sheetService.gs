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

    if (linha[0] && linha[2]) {
      mapa[linha[0].toString().trim()] = linha[2].toString().trim();
    }

    if (linha[3] && linha[5]) {
      mapa[linha[3].toString().trim()] = linha[5].toString().trim();
    }

    if (linha[6] && linha[8]) {
      mapa[linha[6].toString().trim()] = linha[8].toString().trim();
    }
  }

  return mapa;
}
