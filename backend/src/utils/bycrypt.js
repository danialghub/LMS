import bcrypt from 'bcrypt'

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(15)
    return await bcrypt.hash(password, salt);

}

export const comparePassword = async (pass1, pass2) => {
    return await bcrypt.compareSync(pass1, pass2)
}