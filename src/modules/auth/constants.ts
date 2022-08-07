export const jwt_constants = {
    SECRET_KEY: process.env.JWT_SECRET || 'JWT_SECRET',
    EXPIRE_TIME: '1800',
};


// Contains at least one digit, one lower case letter and one upper case letter.
export const password_regex = /(.*[0-9].*[a-z].*[A-Z].*)|(.*[0-9].*[A-Z].*[a-z].*)|(.*[A-Z].*[0-9].*[a-z].*)|(.*[A-Z].*[a-z].*[0-9].*)|(.*[a-z].*[0-9].*[A-Z].*)|(.*[a-z].*[A-Z].*[0-9].*)/;
