
function validations(userDetails, errorDetails) {
    // let errorDetails = {};
    if (!userDetails.fullname || typeof userDetails.fullname !== 'string') {
        errorDetails.fullname = 'Invalid full name' ;
    }
    if (!userDetails.email || !/\S+@\S+\.\S+/.test(userDetails.email)) {
        errorDetails.email = 'Invalid email';
    }
    if (!userDetails.password || userDetails.password.length < 5) {
        errorDetails.password = 'Invalid Password' ;
    }
    if(!userDetails.contact || typeof userDetails.contact !== 'number' || userDetails.contact.length === 10) {
        errorDetails.contact = 'Invalid Phone number';
    }
    if(!userDetails.address) {
        errorDetails.address = 'Invalid Address';
    }
    if(userDetails.address) {
        const requiredFields = ['street', 'city', 'state', 'country', 'postalCode'];
        const missingFields = requiredFields.filter(field => !userDetails.address || !userDetails.address[field]);
        if (missingFields.length > 0) {
            errorDetails.address = `Missing required fields: ${missingFields.join(', ')}`;
        }
    }
    if (!userDetails.isPermanent || typeof userDetails.isPermanent != 'boolean') {
        errorDetails.isPermanent = 'Invalid isPermanent'
    }
    const validDepartments = ['IT', 'HR', 'Sales']; 
    if (!userDetails.department || !validDepartments.includes(userDetails.department)) {
        errorDetails.department = 'Invalid department';
    }
    return errorDetails;
}
module.exports = { validations }
