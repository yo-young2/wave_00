const multer = require('multer');
const fs = require('fs');
const multiparty = require('multiparty');
const xlsx = require('xlsx');
const folder = './list/';

function excelsort() {
  const excelFile = xlsx.readFile("cache/input.xlsx");
  const sheetName = excelFile.SheetNames[0];
  const sheetData = excelFile.Sheets[sheetName];  
  const jsonData = xlsx.utils.sheet_to_json(sheetData, { range: 0, defval: "" });
  let j = jsonData.length
  let checksum = 1000;
  let result = new Array();
  const store_excel = xlsx.utils.book_new();

  for (let i = 0; i < j - 1; i++) {
    let order_number = jsonData[i].수량;
    let float = order_number % 1;
    if (float == 0) {
      for (order_number; order_number > 1; order_number--) {
        let createNumber = Number(jsonData[i].거래처코드) * 10000000000 + Number(jsonData[i].품목코드) * 10000 + checksum;
        let barcode = Number(createNumber)
        let Value = { "거래처명": jsonData[i].거래처명, "거래처코드": jsonData[i].거래처코드, "프로젝트": jsonData[i].프로젝트, "제조사": jsonData[i].제조사, "지역이름": jsonData[i].지역이름, "제품명": jsonData[i].제품명, "품목코드": jsonData[i].품목코드, "바코드": Number(barcode), "규격": jsonData[i].규격, "수량": 1, "비고": jsonData[i].비고 }
        result.push(Value);
        checksum++;
      }
    }
    else if (float != 0) {
      for (order_number; order_number > 1; order_number--) {
        let createNumber = Number(jsonData[i].거래처코드) * 10000000000 + Number(jsonData[i].품목코드) * 10000 + checksum;
        let barcode = Number(createNumber)
        let Value = { "거래처명": jsonData[i].거래처명, "거래처코드": jsonData[i].거래처코드, "프로젝트": jsonData[i].프로젝트, "제조사": jsonData[i].제조사, "지역이름": jsonData[i].지역이름, "제품명": jsonData[i].제품명, "품목코드": jsonData[i].품목코드, "바코드": Number(barcode), "규격": jsonData[i].규격, "수량": 1, "비고": jsonData[i].비고 }
        result.push(Value);
        checksum++;
      }
      let createNumber = Number(jsonData[i].거래처코드) * 10000000000 + Number(jsonData[i].품목코드) * 10000 + checksum;
      let barcode = Number(createNumber)
      Value = { "거래처명": jsonData[i].거래처명, "거래처코드": jsonData[i].거래처코드, "프로젝트": jsonData[i].프로젝트, "제조사": jsonData[i].제조사, "지역이름": jsonData[i].지역이름, "제품명": jsonData[i].제품명, "품목코드": jsonData[i].품목코드, "바코드": Number(barcode), "규격": jsonData[i].규격, "수량": float, "비고": jsonData[i].비고 }
      result.push(Value);
    }
  }
  const outJson = xlsx.utils.json_to_sheet(result, { header: ["거래처명", "거래처코드", "프로젝트", "제조사", "지역이름", "제품명", "품목코드", "바코드", "규격", "수량", "비고"] });

  var Now = new Date();
  var day = String(Now.getDate()).padStart(2, '0');
  var month = String(Now.getMonth() + 1).padStart(2, '0');
  var Year = Now.getFullYear();
  var FileDate = Year + month + day;
  var FilePath = './list/OUTPUT_' + FileDate + '.xlsx';
  xlsx.utils.book_append_sheet(store_excel, outJson);
  xlsx.writeFile(store_excel, FilePath);
};

function excelsort_lj() {
  const excelFile = xlsx.readFile("cache/input_LJ.xlsx");
  const sheetName = excelFile.SheetNames[0];
  
  const sheetData = excelFile.Sheets[sheetName];
  
  const jsonData = xlsx.utils.sheet_to_json(sheetData, { range: 0, defval: "" });
  let j=jsonData.length;
  let turm = '05';
  let storeNum = 20;
  let result = new Array();
  const store_excel = xlsx.utils.book_new();

  for (let i = 0; i < j-1 + 1; i++) {
    const daysBeforeUnixEpoch = 70 * 365 + 19;
    const hour = 60 * 60 * 1000;
    let day = new Date(Math.round((jsonData[i].납품일자 - daysBeforeUnixEpoch) * 24 * hour) + 12 * hour);

    let in_month = String(day).substring(4, 7);
    if (in_month == 'Jul')
      in_month = '7';
    else if (in_month == 'Aug')
      in_month = '8';
    let in_day = String(day).substring(8, 10);
    let barcode = turm + '0' + in_day + in_month + storeNum;
    let Value = { "할당번호": jsonData[i].할당번호, "구매오더": jsonData[i].구매오더, "순번": jsonData[i].순번, "발주점포": jsonData[i].발주점포, "발주점포명": jsonData[i].발주점포명, "상품코드": jsonData[i].상품코드, "상품명": jsonData[i].상품명, "발주일자": jsonData[i].발주일자, "납품일자": jsonData[i].납품일자, "단위": jsonData[i].단위, "입수": jsonData[i].입수, "발주수량": jsonData[i].발주수량, "BOX수량": jsonData[i].BOX수량, "바코드": barcode };
    result.push(Value);
  }
  const outJson = xlsx.utils.json_to_sheet(result, { header: ["할당번호", "구매오더", "순번", "발주점포", "발주점포명", "상품코드", "상품명", "발주일자", "납품일자", "단위", "입수", "발주수량", "BOX수량", "바코드"] });

  var Now = new Date();
  var day = String(Now.getDate()).padStart(2, '0');
  var month = String(Now.getMonth() + 1).padStart(2, '0');
  var Year = Now.getFullYear();
  var FileDate = Year + month + day;
  var FilePath = './list/list_LJ/OUTPUT_' + FileDate + '.xlsx';
  xlsx.utils.book_append_sheet(store_excel, outJson);
  xlsx.writeFile(store_excel, FilePath);
};

module.exports = {
  excelsort,
  excelsort_lj
}