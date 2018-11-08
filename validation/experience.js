const validator = require('validator')
const isEmpty = require('./is-empty')


module.exports = function validExperienceInput(data) {
    let error= {}


    data.title = !isEmpty(data.title)? data.title: ''
    data.company = !isEmpty(data.company)? data.company: ''
    data.from = !isEmpty(data.from)? data.from:''



    if(validator.isEmpty(data.title)){
        error.title ="job title  is required"
    }

    if(validator.isEmpty(data.company)){
        error.comapny ="Company name is required"
    }
    if(validator.isEmpty(data.from)){
        error.from ="From field is required"
    }

    return{
        error,
        isValid:isEmpty(error)
    }

}