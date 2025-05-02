function descobrirSemanaAtual() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  const abaCronograma = planilha.getSheetByName("Cronograma");

  if (!abaCronograma) {
    Logger.log("Aba 'Cronograma' não encontrada!");
    return null;
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  Logger.log(`Hoje é: ${hoje.toLocaleDateString('pt-BR')}`);

  const dados = abaCronograma.getDataRange().getValues();

  for (let i = 0; i < dados.length; i++) {
    const linha = dados[i];
    const dataCelula = linha[0];

    if (!(dataCelula instanceof Date)) continue;

    const dataLinha = new Date(dataCelula);
    dataLinha.setHours(0, 0, 0, 0);

    if (dataLinha > hoje) {
      const semanaCandidata = [linha[1], linha[2], linha[3], linha[4], linha[5]].find(cell => {
        return typeof cell === "string" && cell.startsWith("S");
      });

      if (semanaCandidata) {
        Logger.log(`🔍 Semana futura encontrada: ${semanaCandidata} (linha: ${dataLinha.toLocaleDateString('pt-BR')})`);

        if (semanaCandidata.includes("S1")) return "Semana 1";
        if (semanaCandidata.includes("S2")) return "Semana 2";
        if (semanaCandidata.includes("S3")) return "Semana 3";
      }
    }
  }

  Logger.log("⚠️ Nenhuma semana futura encontrada!");
  return "SEM ESCALA";
}



function buscarMonitoresSemana(semana) {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  const abaEscala = planilha.getSheetByName("Escala Completa");

  if (!abaEscala) {
    Logger.log("Aba 'Escala Completa' não encontrada!");
    return [];
  }

  const dados = abaEscala.getDataRange().getValues();
  const cabecalho = dados.shift(); // Remove o cabeçalho
  
  const listaMonitores = [];

  dados.forEach(linha => {
    if (linha[0] === semana) {
      listaMonitores.push({
        unidade: linha[1],
        turma: linha[2],
        dia: linha[3],
        horario: linha[4],
        monitor: linha[5] ? linha[5].toString().trim().toLowerCase() : ""
      });
    }
  });

  return listaMonitores;
}
