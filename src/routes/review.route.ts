import express from 'express';
var jwt = require('express-jwt');
import asyncHandler from "express-async-handler"
import { getReviews, deleteReview } from '../models/review.model';

export const reviewRoutes = express();

reviewRoutes.get('/find', jwt({ secret: process.env.JWT_SECRET || 'aa', algorithms: ['HS256'] }), asyncHandler(async (req, res) => {
  const users = await getReviews()
  res.send(users);
}));

reviewRoutes.delete('/delete', jwt({ secret: process.env.JWT_SECRET || 'aa', algorithms: ['HS256'] }), asyncHandler(async (req, res) => {
  await deleteReview(req.body.id)
  res.send({ usccess: "Booking deleted"});
}));

