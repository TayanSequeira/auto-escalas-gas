function enviarEmailsMonitores() {
  const semanaAtual = descobrirSemanaAtual();
  
  if (semanaAtual === "SEM ESCALA") {
    Logger.log("📋 Semana sem escala de monitores. Nenhum e-mail enviado.");
    return;
  }

  const monitores = buscarMonitoresSemana(semanaAtual);

  if (monitores.length === 0) {
    Logger.log(`Nenhum monitor encontrado para ${semanaAtual}.`);
    return;
  }

  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  const abaEmails = planilha.getSheetByName("Tutores");
  const mapaEmails = montarMapaEmails(abaEmails);

  enviarEmailsIndividuais(semanaAtual, monitores, mapaEmails);
}