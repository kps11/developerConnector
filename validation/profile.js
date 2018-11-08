const validator = require('validator')
const isEmpty = require('./is-empty')


module.exports = function validProfileInput(data) {
    let error= {}


    data.handle = !isEmpty(data.handle)? data.handle: ''
    data.status = !isEmpty(data.status)? data.status: ''
    data.skills = !isEmpty(data.skills)? data.skills: ''
    
    if (!validator.isLength(data.handle,{min:2,max:40})){
        error.handle='Handle should be between 2 to 40 characters'
    }
    if(validator.isEmpty(data.handle)){
        error.handle='Handle filed is required'
    }
    if (validator.isEmpty(data.status)){
        error.status = 'Status field is required'
    }
    if (validator.isEmpty(data.skills)){
        error.skills = 'skills field is required'
    }
    if (!isEmpty(data.website)){
        if(!validator.isURL(data.website)){
            error.website = 'Not a valid URL'
        }
    }
    if (!isEmpty(data.youtube)){
        if(!validator.isURL(data.youtube)){
            error.youtube = 'Not a valid URL'
        }
    }
    if (!isEmpty(data.instagram)){
        if(!validator.isURL(data.instagram)){
            error.instagram = 'Not a valid URL'
        }
    }
    if (!isEmpty(data.twitter)){
        if(!validator.isURL(data.twitter)){
            error.twitter = 'Not a valid URL'
        }
    }
    if (!isEmpty(data.facebook)){
        if(!validator.isURL(data.facebook)){
            error.facebook = 'Not a valid URL'
        }
    }
    if (!isEmpty(data.linkdin)){
        if(!validator.isURL(data.linkdin)){
            error.linkdin = 'Not a valid URL'
        }
    }



    return{
        error,
        isValid:isEmpty(error)
    }

}