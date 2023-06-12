const multer = require('multer');
const fs = require('fs');
const multiparty = require('multiparty');
const xlsx = require('xlsx');
const folder = './list/';

function excelsort(){
const excelFile = xlsx.readFile("order/input.xlsx");
const sheetName = excelFile.SheetNames[0];
const sheetData = excelFile.Sheets[sheetName];

let j = sheetName.length
const jsonData = xlsx.utils.sheet_to_json(sheetData, {range: 0, defval : ""});
let checksum = 1000;
let result = new Array();
const store_excel = xlsx.utils.book_new();

for(let i=0;i<j+1;i++){
        let order_number = jsonData[i].수량;
        let float = order_number%1;
        if(float==0){
            for(order_number;order_number>1;order_number--){
                let createNumber = Number(jsonData[i].거래처코드)*10000000000 + Number(jsonData[i].품목코드)*10000+checksum;
                //let createbarcode = Number(jsonData[i].거래일)*100000 + checksum;
                let barcode = Number(createNumber)//+Number(createbarcode);
                let Value = {"거래처명" : jsonData[i].거래처명, "거래처코드" : jsonData[i].거래처코드, "프로젝트" : jsonData[i].프로젝트, "제조사":jsonData[i].제조사,"지역이름":jsonData[i].지역이름,"제품명":jsonData[i].제품명,"품목코드":jsonData[i].품목코드,"바코드":Number(barcode),"규격":jsonData[i].규격,"수량":1,"비고": jsonData[i].비고}
                result.push(Value);
                checksum++;
                }
        }
        else if(float!=0){
            for(order_number;order_number>1;order_number--){
            let createNumber = Number(jsonData[i].거래처코드)*10000000000 + Number(jsonData[i].품목코드)*10000+checksum;
            //let createbarcode = Number(jsonData[i].거래일)*100000 + checksum;
            let barcode = Number(createNumber)//+Number(createbarcode);
            let Value = {"거래처명" : jsonData[i].거래처명, "거래처코드" : jsonData[i].거래처코드, "프로젝트" : jsonData[i].프로젝트, "제조사":jsonData[i].제조사,"지역이름":jsonData[i].지역이름,"제품명":jsonData[i].제품명,"품목코드":jsonData[i].품목코드,"바코드":Number(barcode),"규격":jsonData[i].규격,"수량":1,"비고": jsonData[i].비고}
            result.push(Value);
            checksum++;
            }
            let createNumber = Number(jsonData[i].거래처코드)*10000000000 + Number(jsonData[i].품목코드)*10000+checksum;
            let barcode = Number(createNumber)
            Value = {"거래처명" : jsonData[i].거래처명, "거래처코드" : jsonData[i].거래처코드, "프로젝트" : jsonData[i].프로젝트, "제조사":jsonData[i].제조사,"지역이름":jsonData[i].지역이름,"제품명":jsonData[i].제품명,"품목코드":jsonData[i].품목코드,"바코드":Number(barcode),"규격":jsonData[i].규격,"수량": float,"비고": jsonData[i].비고}
            result.push(Value);
    }
}
const outJson = xlsx.utils.json_to_sheet(result,{header:["거래처명","거래처코드","프로젝트","제조사","지역이름","제품명","품목코드","바코드","규격","수량","비고"]});

var Now = new Date();
var day = String(Now.getDate()).padStart(2,'0');
var month = String(Now.getMonth()+1).padStart(2,'0');
var Year = Now.getFullYear();
var FileDate = Year+month+day;
var FilePath = './list/OUTPUT_'+FileDate+'.xlsx';
xlsx.utils.book_append_sheet(store_excel,outJson);
xlsx.writeFile(store_excel,FilePath);
};

module.exports = {
  excelsort
}