const validator = require('validator')
const isEmpty = require('./is-empty')


module.exports = function validPostInput(data) {
    let error= {}


    data.text = !isEmpty(data.text)? data.text: ''


    if (!validator.isLength(data.text,{min:10 ,max:300})){
        error.text= 'The post must be between 10 to 300 characters'
    }
    if(validator.isEmpty(data.text)){
        error.text ="text field is required"
    }


    return{
        error,
        isValid:isEmpty(error)
    }

}