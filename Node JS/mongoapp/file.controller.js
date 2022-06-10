const fs = require('fs');
const PDFDocument = require('pdfkit');


function generateForm(data,doc,callback) {
    function convertDateToUTC(date) {
        var d = new Date(date);
        return d.getDate()+"-"+(d.getMonth()+1)+"-"+d.getFullYear();
    }

	doc.image('logo.png', 500, 45, { width: 50})
		.fillColor('#444444')
		.fontSize(30)
        .fillColor('#0')
        .font('./fonts/zagbold.otf')
		.text('LEAVE FORM', 240, 90, {})
		.moveDown()
        .fontSize(16)

        .font('./fonts/zagbold.otf')
        .text(`Request ID: `, 50, 180)
        .font('./fonts/zagreg.otf')
		.text(data.request_id, 300, 180)

        .font('./fonts/zagbold.otf')
        .text(`Student ID: `, 50, 200)
        .font('./fonts/zagreg.otf')
		.text(data.user_id, 300, 200)

        .font('./fonts/zagbold.otf')
        .text(`Student Name: `, 50, 220)
        .font('./fonts/zagreg.otf')
		.text(data.name, 300, 220)

        .font('./fonts/zagbold.otf')
        .text(`Campus Name: `, 50, 240)
        .font('./fonts/zagreg.otf')
		.text(data.campus_name, 300, 240)

        .font('./fonts/zagbold.otf')
        .text(`Course Name: `, 50, 260)
        .font('./fonts/zagreg.otf')
		.text(data.course_name, 300, 260)

        .font('./fonts/zagbold.otf')
        .text(`Batch: `, 50, 280)
        .font('./fonts/zagreg.otf')
		.text(data.batch, 300, 280)

        .font('./fonts/zagbold.otf')
        .text(`Request Date: `, 50, 300)
        .font('./fonts/zagreg.otf')
		.text(convertDateToUTC(data.request_date), 300, 300)

        .font('./fonts/zagbold.otf')
        .text(`From Date: `, 50, 320)
        .font('./fonts/zagreg.otf')
		.text(convertDateToUTC(data.from_date), 300, 320)

        .font('./fonts/zagbold.otf')
        .text(`To Date: `, 50, 340)
        .font('./fonts/zagreg.otf')
		.text(convertDateToUTC(data.to_date), 300, 340)

        .font('./fonts/zagbold.otf')
        .text(`Reason: `, 50, 360)
        .font('./fonts/zagreg.otf')
		.text(data.reason, 300, 360)
        
		.moveDown()
        .image('sign.png', 480, 650, { width: 100})
        .text('Signature',500,700);

    return callback(data);
}

/*function generateFooter(doc) {
	doc.fontSize(0)
    .text('Payment is due within 15 days. Thank you for your business.',50,700,{ align: 'center', width: 500 },);
}*/


exports.createInvoice = function (data, path, callback) {
	let doc = new PDFDocument({ margin: 50 });

	generateForm(data,doc, function(result){
        doc.pipe(fs.createWriteStream(path))

	    doc.end();
    });


    return callback();

    //return doc.pipe(fs.createReadStream(path));
}


