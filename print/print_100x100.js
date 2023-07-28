const Print = require("pdf-to-printer");
async function printer_100x100() {
    var Now = new Date();
    var day = String(Now.getDate()).padStart(2, '0');
    var month = String(Now.getMonth() + 1).padStart(2, '0');
    var Year = Now.getFullYear();
    var FileDate = Year + month + day;

    const printList = await Print.getPrinters();
    for (var i = 0; i < printList.length; i++) {
        if (printList[i].deviceId.indexOf('100*100') != -1) {
            var printName = printList[i].deviceId;
            break;
        }
        else if (printList[i].deviceId.indexOf('100 * 100') != -1) {
            var printName = printList[i].deviceId;
            break;
        }
        else if (printList[i].deviceId.indexOf('100x100') != -1) {
            var printName = printList[i].deviceId;
            break;
        }
        else if (printList[i].deviceId.indexOf('100 x 100') != -1) {
            var printName = printList[i].deviceId;
            break;
        }
        else if (printList[i].deviceId.indexOf('100X100') != -1) {
            var printName = printList[i].deviceId;
            break;
        }
        else if (printList[i].deviceId.indexOf('100 X 100') != -1) {
            var printName = printList[i].deviceId;
            break;
        }
        else
            console.log('Not found, Printer!')
    }

    const option = {
        printer: printName,
        scale: "noscale",
        paperSize: "WL_100*100"
    };
    Print.print(`docs/${FileDate}_dodam.pdf`, option);
};

module.exports = {
    printer_100x100
  };