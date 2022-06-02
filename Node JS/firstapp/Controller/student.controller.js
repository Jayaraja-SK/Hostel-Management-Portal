const res = require('express/lib/response');
var studentService = require('../Service/student.service');
var file = require('../file.controller');

var fd = require('fs');


exports.addLeaveForm = function (request,response) {
    studentService.addLeaveForm(request.body.data,  function(result){
        response.send("");

    });

}


exports.getLeaveForms = function (request,response) {
    studentService.getLeaveForms(request.params.student_id,  function(result){
        response.send(result);

    });

}


/*exports.getStudentDetails = function (request,response) {
    studentService.getStudentDetails(request.params.user_id,  function(result){
        response.send(result);

    });

}*/


exports.addComplaintReg= function (request,response) {
    studentService.addComplaintReg(request.body.data,  function(result){
        response.send("");

    });

}


exports.getComplaints = function (request,response) {
    studentService.getComplaints(request.params.student_id,  function(result){
        response.send(result);

    });

}


exports.changeComplaintStatus = function (request,response) {
    studentService.changeComplaintStatus(request.params.complaint_id, request.params.status, function(result){
        response.send(result);

    });

}


exports.addBillCancellation= function (request,response) {
    studentService.addBillCancellation(request.body.data,  function(result){
        response.send("");

    });

}


exports.changePassword= function (request,response) {
    studentService.changePassword(request.params.student_id, request.body.data, function(result){
        response.send(result);

    });

}


exports.addFile = function (request,response) {
    studentService.getStudentDetailsLeaveForm(request.body.temp.request_id, request.body.temp.user_id, function(result){
        response.send();

        file.createInvoice(result[0],'./Service/Leave_Requests/'+request.body.temp.request_id+'.pdf' , function(result) {

        })

    });
}


exports.getFile = function (request,response) {

    studentService.getFileName(request.params.request_id, function(result){
        response.sendFile(result);
        //fd.unlinkSync(result, function(result){});
    });
    
}