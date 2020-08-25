import express from 'express';
var jwt = require('express-jwt');
import asyncHandler from "express-async-handler"
import { getBookings, deleteBookings } from '../models/bookings.model';

export const bookingsRoutes = express();

bookingsRoutes.get('/find', jwt({ secret: process.env.JWT_SECRET || 'aa', algorithms: ['HS256'] }), asyncHandler(async (req, res) => {
  const users = await getBookings()
  res.send(users);
}));

bookingsRoutes.delete('/delete/:id', jwt({ secret: process.env.JWT_SECRET || 'aa', algorithms: ['HS256'] }), asyncHandler(async (req, res) => {
  await deleteBookings(req.params.id)
  res.send({ usccess: "Booking deleted"});
}));

