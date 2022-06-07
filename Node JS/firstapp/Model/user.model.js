const mongoose=require('mongoose');
const userSchema=mongoose.Schema({
    email: 
    {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    password: 
    {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    role: String,
    user_id: String
});

module.exports=mongoose.model('User',userSchema);