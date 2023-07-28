const {homeview,generate_pdf,uploadview,ljuploadview,listsview} = require('../controllers/homeController');
// import listsview from "listsview";
// import LJuploadview from "LJuploadview"
// import uploadview from "uploadview";
// import generatePdf from "generatePdf";
// import homeview from "homeview";
const {dodam_print_view, modifyPdf_dodam} = require('../labelforms/dodam_label');
const express = require('express');
const router = express.Router();

router.get('/', homeview);
router.get('/upload', uploadview);
router.get('/upload_LJ', ljuploadview);
router.get('/list', listsview);
router.get('/download', generate_pdf);
router.get('/dodam_printlist', dodam_print_view);
router.get('/dodam_print', modifyPdf_dodam);

module.exports = {
    routes: router
}