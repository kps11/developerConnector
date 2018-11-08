const validator = require('validator')
const isEmpty = require('./is-empty')


module.exports = function validLoginInput(data) {
    let error= {}


    data.email = !isEmpty(data.email)? data.email: ''
    data.password = !isEmpty(data.password)? data.password: ''

    if (!validator.isEmail(data.email)){
        error.email= "email is not valid"
    }

    if(validator.isEmpty(data.email)){
        error.email ="email field is required"
    }

    if(validator.isEmpty(data.password)){
        error.password ="password field is required"
    }

    return{
        error,
        isValid:isEmpty(error)
    }

}