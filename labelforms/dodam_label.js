const { PDFDocument, StandardFonts, rgb, degrees, MultiSelectValueError } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const multiparty = require('multiparty');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const fs_png = require('fs');
const { json } = require("body-parser");

const JsBarcode = require('jsbarcode');
const { Stream } = require('stream');
const canvas = require('canvas');
const { CreatePNG } = require('../barcode/code128_4-1');
const { printer_100x100 } = require('../print/print_100x100');

const dodam_print_view = function (req, res) {
  res.render('dodam_printlist');
}
function modifyPdf_dodam() {
  const todate = '20230703';
  const excelFile = xlsx.readFile(`./list/OUTPUT_${todate}.xlsx`);
  const sheetName = excelFile.SheetNames[0];
  const Datalength = sheetName.length - 1;
  const sheetData = excelFile.Sheets[sheetName];
  const jsonData = xlsx.utils.sheet_to_json(sheetData, { range: 0, defval: "" });

  CreatePNG(jsonData, draw => draw_pdf(draw,result=>remove_dir(result)));
};

async function draw_pdf(jsonData,result) {
  var Now = new Date();
  var day = String(Now.getDate()).padStart(2, '0');
  var month = String(Now.getMonth() + 1).padStart(2, '0');
  var Year = Now.getFullYear();
  var FileDate = Year + month + day;

  const fontfile = './fonts/NanumGothic.ttf';
  const fontfile_0 = './fonts/NanumGothicExtraBold.ttf';

  const doc = await PDFDocument.create();
  const dodam_form = await PDFDocument.load(fs.readFileSync("./labelforms/dodam.pdf"));
  const [mapping_pages] = await doc.copyPages(dodam_form, [0]);
  doc.addPage(mapping_pages);
  doc.registerFontkit(fontkit);
  const customFont = await doc.embedFont(fs.readFileSync(fontfile));
  const NanumGothicExtraBold = await doc.embedFont(fs.readFileSync(fontfile_0));

  console.log('2');
  var pages = doc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();
  console.log(width);

  for (var i = 0; i < jsonData.length; i++) {

    pages[i].drawText(jsonData[i].거래처명, {
      x: 65,
      y: height - 30,
      size: 20,
      font: NanumGothicExtraBold
    });
    pages[i].drawText(jsonData[i].프로젝트, {
      x: 65,
      y: height - 60,
      size: 20,
      font: NanumGothicExtraBold
    });
    pages[i].drawText(jsonData[i].제품명, {
      x: 65,
      y: height - 85,
      size: 14,
      font: customFont
    });
    pages[i].drawText(jsonData[i].규격, {
      x: 65,
      y: height - 120,
      size: 20,
      font: NanumGothicExtraBold
    });
    pages[i].drawText(String(jsonData[i].수량), {
      x: 65,
      y: height - 150,
      size: 20,
      font: NanumGothicExtraBold
    });
    pages[i].drawText(String(Year + '/' + month + '/' + day), {
      x: 170,
      y: height - 240,
      size: 18,
      font: NanumGothicExtraBold
    });

    var barcode_png = await doc.embedPng(fs.readFileSync(`./barcode/cache/code_${i}.png`));
    pages[i].drawImage(barcode_png, {
      x: 20,
      y: height - 245,
      width: 135,
      height: 50
    });
    if (i < jsonData.length - 1) {
      const [mapping_page] = await doc.copyPages(dodam_form, [0]);
      doc.addPage(mapping_page);
      pages = doc.getPages();
    }
  }

  const fileFath = './docs/' + FileDate + '_dodam' + '.pdf';
  if(fs.writeFileSync(fileFath, await doc.save())){result(1)}
  else result(0);
};

function remove_dir(result){
  console.log(result)
  if(!result){
  let i = 0;
  let queue =  new Array;
  fs.readdir('./barcode/cache', function (err, filelist) {
    while (i < filelist.length) {
      queue[i] = filelist[i];
      i = i + 1;
    };
  });
  setTimeout(() => {
    var j=0;
  while (j < queue.length) {
    fs.unlinkSync(`./barcode/cache/${queue[j]}`, function (req, res) { });
    j = j + 1;
  };
  }, 1000);
  console.log("Success remove the directory")
  }
  else
    console.log("Fail remove the directory")
    printer_100x100();
}
module.exports = {
  dodam_print_view,
  modifyPdf_dodam
}

