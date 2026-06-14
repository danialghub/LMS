import jwt from 'jsonwebtoken'
import User from "../Models/User.js";
import { NotFoundException, UnauthorizedException } from "../utils/app.error.js";
import { hashPassword, comparePassword } from "../utils/bycrypt.js";
import {
  generateAccessToken, generateRefreshToken, clearCoockie, setCookie
} from '../utils/jwt.js'
import { Env } from '../config/ENV.config.js';

export const registerService = async (body) => {
  const { name, password, avatar, role, email, instructorProfile } = body;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new UnauthorizedException("کاربر از قبل وجود دارد");

  const hashedPassword = await hashPassword(password)

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    avatar,
    role,
    instructorProfile
  });

  return newUser;
};

export const loginService = async (req, res, body) => {
  const { email, password, role } = body;

  const user = await User.findOne({ email, role });

  if (!user) throw new NotFoundException("ایمیل یا پسورد اشتباه است");


  const isPasswordValid = await comparePassword(password, user.password);


  if (!isPasswordValid)
    throw new UnauthorizedException("ایمیل یا پسورد نامعتبر است");

  const cookies = req.cookies?.jwt

  const newRefreshToken = generateRefreshToken(email, role)
  const newAccessToken = generateAccessToken(email, role)

  let newRefreshTokenArray = !cookies
    ? user.refreshToken
    : user.refreshToken.filter(rt => rt !== cookies)



  if (cookies) {
    const foundToken = await User.findOne({ refreshToken: cookies })
    if (!foundToken) {
      newRefreshTokenArray = []
    }
    clearCoockie(res)
  }

  user.refreshToken = [...newRefreshTokenArray, newRefreshToken]

  await user.save()

  setCookie(res, newRefreshToken)

  return { user, accessToken: newAccessToken };
};

export const refreshTokenService = async (res, token) => {
  if (!token) throw new UnauthorizedException();

  clearCoockie(res);

  const user = await User.findOne({
    refreshToken: token,
  });

  if (!user) {
    jwt.verify(
      token,
      Env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return;

        const hackerUser = await User.findOne({
          email: decoded.email,
        });

        if (hackerUser) {
          hackerUser.refreshToken = [];
          await hackerUser.save();
        }
      }
    );

    throw new ForbiddenException();
  }

  const newRefreshTokenArray =
    user.refreshToken.filter(
      (rt) => rt !== token
    );

  let decoded;

  try {
    decoded = jwt.verify(
      token,
      Env.REFRESH_TOKEN_SECRET
    );
  } catch (err) {
    user.refreshToken = newRefreshTokenArray;
    await user.save();

    throw new ForbiddenException();
  }

  if (decoded.email !== user.email) {
    throw new ForbiddenException();
  }

  const accessToken = generateAccessToken(
    user.email,
    user.role
  );

  const refreshToken = generateRefreshToken(
    user.email,
    user.role
  );

  user.refreshToken = [
    ...newRefreshTokenArray,
    refreshToken,
  ];

  await user.save();

  setCookie(res, refreshToken);

  return {
    user,
    accessToken,
  };
};

export const logOutService = async (res, token) => {

  const user = await User.findOne({ refreshToken: token })

  if (!user) throw new UnauthorizedException()

  user.refreshToken = user.refreshToken.filter(rt => rt !== token)
  await user.save()
  clearCoockie(res)
}