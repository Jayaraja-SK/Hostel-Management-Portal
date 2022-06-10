const req = require('express/lib/request');
const res = require('express/lib/response');
var loginService = require('../Service/login.service');


exports.validateUser = function (request,response) {
    loginService.validateUser(request.body, function(result){
        response.send(result);

    });

}