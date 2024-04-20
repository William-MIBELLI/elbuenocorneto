import * as bcrypt from 'bcryptjs';
//import bcryptjs as bcrypt from 'bcryptjs'
//import * as bcrypt from 'bcrypt';


export const hashPassword = async (password: string) => {
    //const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}

export const isPasswordMatching = async (password: string, hash: string) => {
    //const bcrypt = require('bcrypt');
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
}