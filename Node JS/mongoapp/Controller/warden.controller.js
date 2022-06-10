const req = require('express/lib/request');
const res = require('express/lib/response');
var wardenService = require('../Service/warden.service');

exports.addAdmin = async function () {
    wardenService.addAdmin();
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




exports.getWardens = function (request,response) {
    wardenService.getWardens(function(result){
        response.send(result);

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



