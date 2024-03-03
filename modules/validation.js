function isInvalidText(value, name){
    let response = "";
    if (typeof value !== "string"){
        response = "Please specify a " + name + ".";
    }
    else if(value.trim().length === 0){
        response = name.charAt(0).toUpperCase() + name.slice(1) + " is required."
    }
    return response;
}

function isInvalidEmail(value){
    let response = "";
    let emailPattern = /^[\w\.-]+@[\w\.-]+/g;

    response = isInvalidText(value, "email");
    
    if (!response && !emailPattern.test(value)){
        response = "Please enter a valid email address [example@gmail.com].";
    }

    return response;
}

function isInvalidPassword(value){
    let response = "";
    // Regexp: ensures password contains at least 1 lowercase, uppercase, digit, special char
    // AND does not contain spaces anywhere.
    let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*([^\w\s]|_)).{8,12}$/g;

    response = isInvalidText(value, "password");

    if(!response && !passwordPattern.test(value.trim())){
        response = "Ensure password is between 8-12 characters, and has at least 1 of each: Special Character, Capital & Lowercase letter, digit."
    }

    return response;
}


module.exports = {isInvalidEmail, isInvalidPassword, isInvalidText};