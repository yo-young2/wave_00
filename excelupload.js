const multer = require('multer');
const fs = require('fs');
const multiparty = require('multiparty');
const xlsx = require('xlsx');

const excelFile = xlsx.readFile("order_ssg/input.xlsx");
const sheetName = excelFile.SheetNames[0];
const Datalength = sheetName.length-1;
const sheetData = excelFile.Sheets[sheetName];
const jsonData = xlsx.utils.sheet_to_json(sheetData, {range: 0, defval : ""});

module.exports = {
  jsonData,
  Datalength
}