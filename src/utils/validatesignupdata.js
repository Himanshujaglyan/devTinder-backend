const validator = require("validator");

const validatesignupdata = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {   
        throw new Error("Name is required");
    } 
    else if (firstName.length < 3 || firstName.length > 15) {
        throw new Error("First name should be between 3 to 15 characters");
    } 
    else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
    } 
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Password must be at least 8 characters long with 1 uppercase, 1 number, and 1 special character.");
    }
};

const validateProfileUpdateDate = (req)=>{
    //so yaha me sirf yai check kerunga ke user sirf yai fields ko update ker paye or eske alawa kuch nahi
    const allowedFields = ["lastName","age","gender"];

    const isEditAllowed = Object.keys(req.body).every(field => allowedFields.includes(field));
    return isEditAllowed;//it return true or false ager sub match kera to true nahi to false;
}

module.exports = { validatesignupdata,validateProfileUpdateDate };
