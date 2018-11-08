const validator = require('validator')
const isEmpty = require('./is-empty')


module.exports = function validRegisterInput(data) {
    error= {}

    data.name = !isEmpty(data.name)? data.name: ''
    data.email = !isEmpty(data.email)? data.email: ''
    data.password = !isEmpty(data.password)? data.password: ''
    data.password2 = !isEmpty(data.password2)? data.password2: ''

    if (!validator.isLength(data.name,{min:2,max:30})){
        error.name = 'Length of the name will be between  2 to 30 characters'
    }

    if(validator.isEmpty(data.name)){
        error.name ="name field is required"
    }
    if(validator.isEmpty(data.email)){
        error.email ="email field is required"
    }
    if (!validator.isEmail(data.email)){
        error.email= "email is not valid"
    }
    if(validator.isEmpty(data.password)){
        error.password ="password field is required"
    }
    if (!validator.isLength(data.password,{min:6 ,max:30})){
        error.password = 'minimum length of the password must be between 6 and 30'
    }
    if(validator.isEmpty(data.password2)){
        error.password2 ="confirm password2 field is required"
    }
    if(!validator.equals(data.password,data.password2)){
        error.password2 ="password must match"
    }

    return{
        error,
        isValid:isEmpty(error)
    }
    
}