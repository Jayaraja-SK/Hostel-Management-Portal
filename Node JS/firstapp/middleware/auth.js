const jwt = require('jsonwebtoken');
const role=require('./role');

module.exports = function (request, response, next) {
    var token;
    
    if(request.header('x-auth-header') === undefined)
    {
        token = request.body.headers['x-auth-header'];
    }
    else
    {
        token = request.header('x-auth-header');
    }
    
    if (!token)
    {
        return response.status(200).send('NO TOKEN');
    }

    try {
        const decoded = jwt.verify(token, "secretkey");

        if(role[decoded.role].find(function(url) {
            return url==request.baseUrl
            }))
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