import { Env } from "../config/ENV.config.js";
import jwt from 'jsonwebtoken'

export function generateAccessToken(email, role) {
    return jwt.sign(
        { email, role },
        Env.ACCESS_TOKEN_SECRET,
        { expiresIn: Env.ACCESS_TOKEN_EXPIRES_IN }
    );
}
export function generateRefreshToken(email, role) {
    return jwt.sign(
        { email, role },
        Env.REFRESH_TOKEN_SECRET,
        { expiresIn: Env.REFRESH_TOKEN_EXPIRES_IN }
    );
}


export function clearCoockie(res) {
    res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: "None" })
}
export function setCookie(res, refreshToken) {
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 1000 * 60 * 60 * 24 * 7  //7day
    })
}