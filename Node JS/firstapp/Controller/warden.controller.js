const req = require('express/lib/request');
const res = require('express/lib/response');
var wardenService = require('../Service/warden.service');

exports.addAdmin = async function () {
    wardenService.addAdmin();
}

exports.addStudent = function (request,response) {
    wardenService.addUser(request.body.data, function(result){
        response.send(result);

        if(result == true)
        {
            wardenService.addStudent(request.body.data, function(result) {

            })
        }
    });

}


exports.editStudent = function (request,response) {
    wardenService.editStudent(request.body.data, request.params.student_id,  function(result){
        response.send("");

    });

}


exports.addWarden = function (request,response) {
    wardenService.addUser(request.body.data, function(result){
        response.send(result);

        if(result == true)
        {
            wardenService.addWarden(request.body.data, function(result) {

            })
        }
    });

}


exports.editWarden = function (request,response) {
    wardenService.editWarden(request.body.data, request.params.warden_id,  function(result){
        response.send("");

    });

}


exports.getStudents = function (request,response) {
    wardenService.getStudents(request.params.campus_id, request.params.course_id, request.params.batch, function(result){
        response.send(result);

    });

}


exports.getStudentInfoByEmail = function (request,response) {
    wardenService.getStudentInfoByEmail(request.params.email, function(result){
        response.send(result);

    });

}

exports.getBatches = function (request,response) {
    wardenService.getBatches(request.params.campus_id, request.params.course_id, function(result){
        response.send(result);

    });

}


exports.deleteStudents = function (request,response) {
    wardenService.deleteStudents(request.params.campus_id, request.params.course_id, request.params.batch, function(result){
        response.send("");

    });

}


exports.deleteStudentsByCampusBatch = function (request,response) {
    wardenService.deleteStudentsByCampusBatch(request.params.campus_id, request.params.batch, function(result){
        response.send("");

    });

}



exports.getWardens = function (request,response) {
    wardenService.getWardens(function(result){
        response.send(result);

    });

}


exports.getMessDetails = function (request,response) {
    wardenService.getMessDetails(function(result){
        response.send(result);

    });

}


exports.addMess = function (request,response) {
    wardenService.addUser(request.body.data, function(result){
        response.send(result);

        if(result == true)
        {
            wardenService.addMess(request.body.data, function(result) {

            })
        }
    });

}


exports.editMess = function (request,response) {
    wardenService.editMess(request.body.data, request.params.mess_id,  function(result){
        response.send("");

    });

}


exports.editUser = function (request,response) {
    wardenService.editUser(request.body.data, request.params.user_id, function(result){
        response.send(result);
    });

}


exports.editPassword = function (request,response) {
    wardenService.editPassword(request.body.data, request.params.user_id, function(result){
        response.send("");
    });

}



exports.deleteUser = function (request,response) {
    wardenService.deleteUser(request.params.user_id, function(result){
        response.send("");
    });

}



exports.addCampus = function (request,response) {
    wardenService.addCampus(request.body.data, function(result){
        response.send("");

    });

}


exports.editCampus = function (request,response) {
    wardenService.editCampus(request.body.data, request.params.campus_id,  function(result){
        response.send("");

    });

}



exports.deleteCampus = function (request,response) {
    wardenService.deleteCampus(request.params.campus_id, function(result){
        response.send(result);
    });

}


exports.getAllCampus = function (request,response) { 
    wardenService.getAllCampus(function(result){
        response.send(result);

    });

}



exports.addCourse = function (request,response) {
    wardenService.addCourse(request.body.data, request.params.campus_id,  function(result){
        response.send("");

    });

}


exports.editCourse = function (request,response) {
    wardenService.editCourse(request.body.data, request.params.course_id,  function(result){
        response.send("");

    });

}



exports.deleteCourse = function (request,response) {
    wardenService.deleteCourse(request.params.course_id, function(result){
        response.send(result);
    });

}


/*exports.getCampusDetails = function (request,response) {
    wardenService.getCampusDetails(function(result){
        var filteredResult = {};

        var i;

        for(i=0;i<result.length;i++)
        {
            if(!(result[i].campus_id in filteredResult))
            {
                filteredResult[result[i].campus_id] = {"campus_name":result[i].campus_name,"campus_loc":result[i].campus_loc,"courses":[]};
            }

            filteredResult[result[i].campus_id]["courses"].push({"course_id":result[i].course_id,"degree":result[i].degree,"course_name":result[i].course_name,"no_of_years":result[i].no_of_years});            

        }

        response.send(filteredResult);

    });

}*/



exports.getCoursesByCampus = function (request,response) { 
    wardenService.getCoursesByCampus(request.params.campus_id, function(result){
        response.send(result);

    });

}


exports.addWardenStudentRel = function (request,response) { 
    wardenService.addWardenStudentRel(request.body.data, function(result){
        response.send(result);

    });

}


exports.getWardenStudentRel = function (request,response) { 
    wardenService.getWardenStudentRel(function(result){
        response.send(result);

    });

}


exports.deleteWardenStudentRel = function (request,response) { 
    wardenService.deleteWardenStudentRel(request.params.warden_id,request.params.campus_id,request.params.batch, function(result){
        response.send(result);

    });

}


exports.addMessStudentRel = function (request,response) { 
    wardenService.addMessStudentRel(request.body.data, function(result){
        response.send(result);

    });

}


exports.getMessStudentRel = function (request,response) { 
    wardenService.getMessStudentRel(function(result){
        response.send(result);

    });

}


exports.deleteMessStudentRel = function (request,response) { 
    wardenService.deleteMessStudentRel(request.params.mess_id,request.params.campus_id,request.params.batch, function(result){
        response.send(result);

    });

}



exports.getLeaveForms = function (request,response) { 
    wardenService.getLeaveForms(request.params.warden_id, function(result){
        response.send(result);

    });

}


exports.getLeaveFormsByDateStatus = function (request,response) { 
    wardenService.getLeaveFormsByDateStatus(request.params.warden_id, request.params.status, request.params.from_date, request.params.to_date, function(result){
        response.send(result);

    });

}



exports.changeLeaveFormStatus = function (request,response) {
    wardenService.changeLeaveFormStatus(request.params.request_id, request.params.status, function(result){
        response.send("");

    });

}


exports.getLeaveFormsByStudentId = function (request,response) {
    wardenService.getLeaveFormsByStudentId(request.params.warden_id, request.params.student_id,function(result){
        response.send(result);

    });

}


exports.getAllComplaints = function (request,response) {
    wardenService.getAllComplaints(request.params.warden_id, request.params.complaint_type, request.params.status, request.params.from_date, request.params.to_date,function(result){
        response.send(result);

    });

}


exports.changePassword= function (request,response) {
    wardenService.changePassword(request.params.sub_warden_id, request.body.data, function(result){
        response.send(result);

    });

}