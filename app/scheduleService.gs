function descobrirSemanaAtual() {
  // (Seu código completo de descobrirSemanaAtual)
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
        monitor: linha[5]
      });
    }
  });

  return listaMonitores;
}
