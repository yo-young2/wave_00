const fs = require('fs');
const path = require('path');
const pdf = require('pdf-creator-node');
const {jsonData, Datalength} = require('./excelupload');
const options = require('../helpers/options');

const data = require('../helpers/data');

const generatePdf = async (req, res, next) => {
        const html = fs.readFileSync(path.join(__dirname, './labelforms/ssg_label.html'), 'utf-8');
        const filename = Math.random() + '_doc' + '.pdf';
        let array = [];

        data.forEach(d => {
            const prod = {
                name: d.name,
                description: d.description,
                unit: d.unit,
                quantity: d.quantity,
                price: d.price,
                total: d.quantity * d.price,
                imgurl: d.imgurl
            }
            array.push(prod);
        });

        let subtotal = 0;
        array.forEach(i => {
            subtotal += i.total
        });
        const tax = (subtotal * 20) / 100;
        const grandtotal = subtotal - tax;
        const obj = {
            prodlist: array,
            subtotal: subtotal,
            tax: tax,
            gtotal: grandtotal
        }
        const document = {
            html: html,
            data: {
                products: obj
            },
            path: './docs/' + filename
        }
        pdf.create(document, options)
            .then(res => {
                console.log(res);
            }).catch(error => {
                console.log(error);
            });
            const filepath = './docs/' + filename;
            console.log(filepath);
            res.render('download', {
                path: filepath
            });
}
module.exports = {
    generatePdf
}