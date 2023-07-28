const {homeview, generatePdf,uploadview, LJuploadview, listsview}  = require('../controllers/homeController');
const {dodam_print_view, modifyPdf_dodam}  = require('../labelforms/dodam_label');
const express = require('express');
const router = express.Router();

router.get('/', homeview);
router.get('/upload', uploadview);
router.get('/upload_LJ', LJuploadview);
router.get('/list', listsview);
router.get('/download', generatePdf);
router.get('/dodam_printlist', dodam_print_view);
router.get('/dodam_print', modifyPdf_dodam);

module.exports = {
    routes: router
}