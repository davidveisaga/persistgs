const sheetName = 'Sheet1'
const scriptProp = PropertiesService.getScriptProperties()

function intialSetup () {
 const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
 //SpreadsheetApp es el servicio que nos permite conectarnos con Google Sheets
 //Por si solo no hace nada, nos sirve segun el método seleccionado.
 
 //Una vez conectados con Sheets, el método getActiveSpreadsheet()
 //nos permite conectarnos con un archivo o libro

 //Al guardarlo en una variable, solo llamamos el método una vez
 //a partir de ahi usamos la variable «activeSpreadsheet» 

 scriptProp.setProperty('key', activeSpreadsheet.getId())
}


//Para que Google App Script se puede utilizar como aplicación web (que se puede acceder a él mediante
// el navegador ... para que cualquier script funcione como una aplicación web, el script debe
// cumplir con dos requisitos: 
// (1) incluir una función doGet() o doPost()
// las funciones doGet() y doPost() funcionan como los controladores http get y post request
// respectivamente.
// (2) que la función devuelva un objeto HTML Servicio HtmlOutput o 
// un objeto Content Service TextOutput.

function doPost (e) {
 const lock = LockService.getScriptLock()
 lock.tryLock(10000) // Espera 10 segundos ahtes de darse por vencido.

 try {
   const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
   //El método openById() nos da otra posibilidad de abrir un archivo específico
   

   const sheet = doc.getSheetByName(sheetName)
   //Con el método getSheetByName()podemos escoger una pestaña especifica

   const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
   //con el método getRange() podemos acceder a una celda o a un grupo de celdas específicas.
   //Una vez tenemos acceso a una celda, para saber que valor tiene esa celda usamos getValue()
   //me devolvera un numero, texto o fecha, dependiendo de lo que haya en la celda


   const nextRow = sheet.getLastRow() + 1

   const newRow = headers.map(function(header) {
     return header === 'Date' ? new Date() : e.parameter[header]
   })

   sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow])
   //Si quiero escribir un dato en la celda usamos el método setValue()

   return ContentService
     .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
     .setMimeType(ContentService.MimeType.JSON)
 }

 catch (e) {
   return ContentService
     .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
     .setMimeType(ContentService.MimeType.JSON)
 }

 finally {
   lock.releaseLock()
 }
}
