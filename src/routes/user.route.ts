import express from 'express';
var jwt = require('express-jwt');
import asyncHandler from "express-async-handler"
import { checkSchema } from "express-validator"
import { sign } from 'jsonwebtoken'
import { validateParams } from '../middlewares/routeValidation.middleware';
import { ApiError } from '../utils/ApiError';
import * as userController from '../models/user.model';

const userData = { role: "SUPER_ADMIN", email: "super_admin@nextlevel.com", name: "Admin" }

export const userRoutes = express();

userRoutes.post('/login', validateParams(checkSchema({
  email: {
    in: ['body'],
    exists: {
      errorMessage: 'Missing field'
    },
    isEmpty: {
      errorMessage: 'Missing field',
      negated: true
    },
    trim: true
  },
  password: {
    in: ['body'],
    exists: {
      errorMessage: 'Missing field'
    },
    isEmpty: {
      errorMessage: 'Missing field',
      negated: true
    },
    trim: true
  },
})), asyncHandler(async (req, res) => {
  const { email, password} = req.body;

  if (email != "super_admin@nextlevel.com") throw new ApiError("Wrong email or password")
  if (password != "CxQnx5rR") throw new ApiError("Wrong email or password")


  var token = sign(userData, process.env.JWT_SECRET || 'aa', { expiresIn: '9999 years'});
  res.send({ ...userData, token });
}));

userRoutes.get('/find/:type?', jwt({ secret: process.env.JWT_SECRET || 'aa', algorithms: ['HS256'] }), asyncHandler(async (req, res) => {
  const users = await userController.getUsers()
  res.send(users);
}));

userRoutes.delete('/delete', jwt({ secret: process.env.JWT_SECRET || 'aa', algorithms: ['HS256'] }), asyncHandler(async (req, res) => {
  await userController.deleteUser(req.body.id)
  res.send({ usccess: "User deleted"});
}));

userRoutes.post('/verify', jwt({ secret: process.env.JWT_SECRET || 'aa', algorithms: ['HS256'] }), asyncHandler(async (req, res) => {
  await userController.setVerify(req.body.id, req.body.isVerified, req.body.entity)
  res.send({ usccess: "User deleted"});
}));

userRoutes.get('/get', jwt({ secret: process.env.JWT_SECRET || 'aa', algorithms: ['HS256'] }), asyncHandler(async (req, res) => {
  res.send(userData);
}));
