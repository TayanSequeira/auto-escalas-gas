function enviarEmailsIndividuais(semana, monitores, mapaEmails) {
  const agrupadoPorMonitor = agruparMonitores(monitores);

  for (const monitor in agrupadoPorMonitor) {
    const email = mapaEmails[monitor];
    if (email) {
      const corpoEmail = construirCorpoEmailIndividual(semanaAtual, monitor, agrupadoPorMonitor[monitor]);
      MailApp.sendEmail({
        to: email,
        subject: `Sua Escala de Plantão - ${semana}`,
        htmlBody: corpoEmail
      });
      Logger.log(`📧 E-mail enviado para: ${monitor} - ${email}`);
    } else {
      Logger.log(`⚠️ E-mail não encontrado para: ${monitor}`);
    }
  }
}

function construirCorpoEmailIndividual(semana, monitor, lista) {
  let corpo = `<h2>Olá ${monitor},</h2>`;
  corpo += `<p>Segue sua escala de plantões para a <strong>${semana}</strong>:</p><ul>`;

  lista.forEach(item => {
    corpo += `<li>${item.unidade} - ${item.turma} - ${item.dia} - ${item.horario}</li>`;
  });

  corpo += `</ul>`;

  corpo += `<p>Consulte o drive para detalhes de plantão:</p>`;
  corpo += `<p><a href="https://drive.google.com/drive/folders/SEU_LINK_AQUI" target="_blank" style="font-size:16px; background-color:#4285F4; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">📂 Acessar Escala no Drive</a></p>`;

  corpo += `<p>Atenciosamente,<br>Coordenação OAP</p>`;

  return corpo;
}

function agruparMonitores(lista) {
  const agrupado = {};
  lista.forEach(item => {
    if (!agrupado[item.monitor]) agrupado[item.monitor] = [];
    agrupado[item.monitor].push(item);
  });
  return agrupado;
}
