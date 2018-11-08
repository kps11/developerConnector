const validator = require('validator')
const isEmpty = require('./is-empty')


module.exports = function validEducationInput(data) {
    let error= {}


    data.school = !isEmpty(data.school)? data.school: ''
    data.degree = !isEmpty(data.degree)? data.degree: ''
    data.from = !isEmpty(data.from)? data.from:''
    data.fieldofstudy = !isEmpty(data.fieldofstudy)?data.fieldofstudy:''



    if(validator.isEmpty(data.school)){
        error.school ="school name is required"
    }

    if(validator.isEmpty(data.degree)){
        error.degree ="Degree name is required"
    }
    if(validator.isEmpty(data.from)){
        error.from ="From field is required"
    }
    if(validator.isEmpty(data.fieldofstudy)){
        error.fieldofstudy ="Field of study  is required"
    }

    return{
        error,
        isValid:isEmpty(error)
    }

}