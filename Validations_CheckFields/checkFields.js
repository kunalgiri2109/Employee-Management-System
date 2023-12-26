function checkFields(userDetails, missingFields) {
    const requiredFields = ['fullname', 'email', 'password', 'contact', 'address', 'department'];
    // const missingFields = {};

    for (const field of requiredFields) {
        if (!userDetails[field]) {
            missingFields[field] = `Missing ${field}`;
        }
    }
    return missingFields;
}

module.exports = { checkFields };
