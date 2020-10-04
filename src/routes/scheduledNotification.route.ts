import express from 'express';
var jwt = require('express-jwt');
import asyncHandler from "express-async-handler"
import { deleteScheduledNotification, getScheduledNotification, saveScheduledNotification } from '../models/scheduledNotification.model';

export const scheduledNotificationRoutes = express();

scheduledNotificationRoutes.get('/find', jwt({ secret: process.env.JWT_SECRET || 'aa', algorithms: ['HS256'] }), asyncHandler(async (req, res) => {
  const notifications = await getScheduledNotification()
  res.send(notifications);
}));

scheduledNotificationRoutes.post('/create', jwt({ secret: process.env.JWT_SECRET || 'aa', algorithms: ['HS256'] }), asyncHandler(async (req, res) => {
  const notifications = await saveScheduledNotification(req.body)
  res.send(notifications);
}));

scheduledNotificationRoutes.delete('/delete', jwt({ secret: process.env.JWT_SECRET || 'aa', algorithms: ['HS256'] }), asyncHandler(async (req, res) => {
  await deleteScheduledNotification(req.body.id)
  res.send({ usccess: "ScheduledNotification deleted"});
}));

