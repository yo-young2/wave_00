const multiparty = require('multiparty');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const JsBarcode = require('jsbarcode');
const { Stream } = require('stream');
const canvas = require('canvas');

function CreatePNG(data,draw) {
    for (var j = 0; j < data.length; j++) {      
      var cache_canvas = canvas.createCanvas();
      JsBarcode(cache_canvas, data[j].바코드, {
        format: "CODE128"
      });
      let cache_Stream = cache_canvas.createPNGStream();
      let out = fs.createWriteStream(`./barcode/cache/code_${j}.png`);
      cache_Stream.pipe(out);
    }
    console.log('done!');
    setTimeout(() => {
        draw(data);    
    }, 3000);
  };

  module.exports = {
    CreatePNG
  };