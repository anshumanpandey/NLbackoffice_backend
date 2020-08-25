import express from 'express';
var jwt = require('express-jwt');
import asyncHandler from "express-async-handler"
import { getPost, deletePosts } from '../models/post.model';

export const postsRoutes = express();

postsRoutes.get('/find', jwt({ secret: process.env.JWT_SECRET || 'aa', algorithms: ['HS256'] }), asyncHandler(async (req, res) => {
  const users = await getPost()
  res.send(users);
}));

postsRoutes.delete('/delete/:id', jwt({ secret: process.env.JWT_SECRET || 'aa', algorithms: ['HS256'] }), asyncHandler(async (req, res) => {
  await deletePosts(req.params.id)
  res.send({ usccess: "Booking deleted"});
}));

