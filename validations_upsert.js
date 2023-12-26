
function validationsUpsert(userDetails) {
    // console.log(userDetails.fullname);
    let errorDetails = [];
    if('fullname' in userDetails) {
        if (typeof userDetails.fullname !== 'string') {
            errorDetails.push( 'Invalid full name' );
        }
    }
    if('email' in userDetails) {
        if (!/\S+@\S+\.\S+/.test(userDetails.email)) {
            errorDetails.push( 'Invalid Email ' );
        }
    }
    if('password' in userDetails) {
        if (userDetails.password.length < 5) {
            errorDetails.push( ' Invalid password ' );
        }
    }
    if('contact' in userDetails) {
        if (!/\S+@\S+\.\S+/.test(userDetails.contact)) {
            errorDetails.email = 'Invalid email';
        }
    }
    if('dateOfBirth' in userDetails) {
        const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateFormatRegex.test(userDetails.dateOfBirth)) {
            errorDetails.dateOfBirth = 'Invalid Date of birth';
        }
    }
    if('address' in userDetails) {
        
    }
    if('isPermanent' in userDetails) {
        
    }
    if('skills' in userDetails) {
         
    }
    if('email' in userDetails) {
        
    }
    if('email' in userDetails) {
        
    }
    const validDepartments = ['IT', 'HR', 'Sales']; 
    if (userDetails.department || !validDepartments.includes(userDetails.department)) {
        errorDetails.department = 'Invalid department'
    }
    return errorDetails;
}
module.exports = { validationsUpsert }
