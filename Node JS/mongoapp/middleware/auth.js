const jwt = require('jsonwebtoken');
const role=require('./role');

module.exports = function (request, response, next) {
    var token,user_id;

    //console.log(request.body.headers)
    
    if(request.header('x-auth-header') === undefined)
    {
        token = request.body.headers['x-auth-header'];
        user_id = request.body.headers['user-id'];
    }
    else
    {
        token = request.header('x-auth-header');
        user_id = request.header('user-id')
    }
    
    if (!token)
    {
        return response.status(200).send('NO TOKEN');
    }

    try {
        const decoded = jwt.verify(token, "secretkey");

        //console.log(decoded.role,decoded._id,decoded.user_id,user_id)

        if(role[decoded.role].find(function(url) {
            return url==request.baseUrl
            }) && decoded.user_id==user_id)
        {
            request.user=decoded
            next();
        }
        else
        {
            // return response.status(200).send({msg:'NO TOKEN',role:role[decoded.rule][0]});
            
            return response.status(200).send('ACCESS DENIED');
        }
    }
    
    catch (ex) {
        response.status(200).send('INVALID TOKEN')
    }
}