import express from 'express';
import { userRoutes } from './user.route';
import { bookingsRoutes } from './bookings.route';
import { postsRoutes } from './posts.route';
import { reviewRoutes } from './review.route';

export const routes = express();

routes.use("/user",userRoutes)
routes.use("/booking",bookingsRoutes)
routes.use("/post",postsRoutes)
routes.use("/review",reviewRoutes)
