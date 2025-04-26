#  Auto Escalas GAS

Automatização do envio de escalas semanais dos plantões de monitores do OAP, usando Google Sheets, Google Apps Script e o CLASP.

##  O que é esse projeto?

Esse projeto surgiu para resolver uma dor real: toda semana era necessário abrir planilhas, conferir escalas manualmente e mandar e-mails para os monitores.  
Isso era demorado e sujeito a erros.

Agora, o envio é feito de forma automática:
- A partir das planilhas, identifica quem está de plantão.
- Agrupa os horários certinhos.
- Cada monitor recebe um e-mail personalizado, sem precisar ninguém ficar controlando isso toda semana.

Tudo rodando direto no ambiente Google (sem precisar servidor ou infraestrutura pesada).

---

##  Como o projeto funciona

A automação faz:
- **Identificação da semana atual** (baseado na data).
- **Busca automática** da escala certa no Google Sheets.
- **Agrupamento** das informações por monitor.
- **Envio de e-mail individualizado** para cada monitor, com seus dias e horários.

**Tecnologias usadas**:
- Google Apps Script (serverless)
- CLASP (para gerenciar e versionar o projeto localmente)
- Git/GitHub

---

##  Estrutura de pastas

```plaintext
auto-escala-gas/
├── .clasp.json          # Arquivo que conecta o CLASP ao Apps Script
├── app/
│   ├── appsscript.json   # Manifesto padrão do Apps Script
│   ├── main.gs           # Função principal de envio
│   ├── emailService.gs   # Geração dos e-mails personalizados
│   ├── scheduleService.gs # Lógica para descobrir semana ativa
│   ├── sheetService.gs   # Funções que extraem e organizam a escala do Sheets
