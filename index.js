const { excelsort, excelsort_LJ } = require('./excelconversion');
//const {dateFormet} = require('./date');
const multer = require('multer');
const express = require('express');
const moment = require('moment');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const http = require('http');
const expressLayouts = require('express-ejs-layouts');
const multiparty = require('multiparty');
const bodyParser = require('body-parser');
const { Console } = require('console');
const app = express();
const port = 3000;
const folder = './list';
const day = new Date();
const homeRoutes = require('./routes/home-routes');

app.use(homeRoutes.routes);
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/list', express.static(path.join(__dirname, 'list')));
app.use('/docs', express.static(path.join(__dirname, 'docs')));

app.locals.pretty = true;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'cache/');
  },
  filename: function (req, file, cb) {
    cb(null, 'input.xlsx');
  }
});
const storage_LJ = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'cache/');
  },
  filename: function (req, file, cb) {
    cb(null, 'input_LJ.xlsx');
  }
});
const upload = multer({ storage: storage });
const upload_LJ = multer({ storage: storage_LJ });

app.listen(3000, function(req,res){
   console.log('App is listening on url http://localhost:3000');
});
app.post('/list', function (req, res) {
  if (req.body.userdate != '' && req.body.filename != undefined) {
    fs.unlinkSync(`./list/${req.body.filename}`, function (req, res) { });
    fs.readdir(folder, function (err, filelist) {
      var list = '<ul>';
      var i = 0;
      list = list + `<form action='../list' method='post'>`;
      while (i < filelist.length) {
        list = list + `<input type='checkbox' name='filename' value='${filelist[i]}'/><a href="./list/${filelist[i]}" download>${filelist[i]}</a><br>`;
        i = i + 1;
      };
      list = list + `<input type='submit'></input>`;
      var template = `
        <!doctype html>
        <html>
          <head>
            <title>FILELIST</title>
            <meta charset = "utf-8">
          </head>
          <body>
            <h1>완료 목록</h1>
            ${list}
            </form>
            <button onclick="location.href='../'">처음</button>
            <ul>
          </body>
        </html>`;
      res.end(template);
    });
  }
  else {
    fs.readdir(folder, function (err, filelist) {
      var list = '<ul>';
      var i = 0;
      if (req.body.userdate == '') {
        list = list + `<form action='../list' method='post'>`;
        while (i < filelist.length) {
          list = list + `<input type='checkbox' name='filename' value='${filelist[i]}'/><a href="./list/${filelist[i]}" download>${filelist[i]}</a><br>`;
          i = i + 1;
        }
        list = list + `<input type='submit'></input>`;
      }
      else {
        var comDate = moment(req.body.userdate).format("YYYYMMDD");
        var j = 0;
        while (i < filelist.length) {
          var name = String(filelist[i]);
          if (name.includes(comDate))
            list = list + `<li><a href="./list/${filelist[i]}" download>${filelist[i]}</a></li>`;
          else
            j++;
          i = i + 1;
          if (filelist.length == j)
            list = '일치항목 없음';
        }
      }
      var template = `
    <!doctype html>
    <html>
      <head>
        <meta charset = "utf-8">
      </head>
      <body>
        <h1>완료 목록</h1>
        ${list}
        </form>
        <button onclick="location.href='../'">처음</button><ul>
      </body>
    </html>`;
      res.end(template);
    });
  };
});
app.post('/upload', upload.single('userfile'), function (req, res) {
  excelsort();
  fs.readdir(folder, function (err, filelist) {
    var list = '<ul>'
    var i = 0;
    while (i < filelist.length) {
      list = list + `<li><a href="./list/${filelist[i]}" download>${filelist[i]}</a></li>`;
      i = i + 1;
    }
    list = list + `<button onclick="location.href='../'">처음</button><ul>`;
    var template = `
    <!doctype html>
    <html>
      <head>
        <meta charset = "utf-8">
      </head>
      <body>
        <h1>완료 목록</h1>
        ${list}
      </body>
    </html>`;
    res.end(template);
  });
});

app.post('/upload_LJ', upload_LJ.single('userfile'), function (req, res) {
  excelsort_LJ();
  fs.readdir('./list/list_LJ', function (err, filelist) {
    var list = '<ul>'
    var i = 0;
    while (i < filelist.length) {
      list = list + `<li><a href="./list/list_LJ/${filelist[i]}" download>${filelist[i]}</a></li>`;
      i = i + 1;
    }
    list = list + `<button onclick="location.href='../'">처음</button><button onclick="/dodam_print">출력</button><ul>`;
    var template = `
    <!doctype html>
    <html>
      <head>
        <meta charset = "utf-8">
      </head>
      <body>
        <h1>완료 목록</h1>
        ${list}
      </body>
    </html>`;
    res.end(template);
  });
});

// app.post('/dodam_print', upload.single('userfile'), function (req, res) {
//   excelsort();
//   fs.readdir(folder, function (err, filelist) {
//     var list = '<ul>'
//     var i = 0;
//     while (i < filelist.length) {
//       list = list + `<li><a href="./list/${filelist[i]}" download>${filelist[i]}</a></li>`;
//       i = i + 1;
//     }
//     list = list + `<button onclick="location.href='../'">처음</button><ul>`;
//     var template = `
//     <!doctype html>
//     <html>
//       <head>
//         <meta charset = "utf-8">
//       </head>
//       <body>
//         <h1>완료 목록</h1>
//         ${list}
//       </body>
//     </html>`;
//     res.end(template);
//   });
// });