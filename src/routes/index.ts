import express from "express";
import { userRoutes } from "./user.route";
import { bookingsRoutes } from "./bookings.route";
import { postsRoutes } from "./posts.route";
import { reviewRoutes } from "./review.route";
import { scheduledNotificationRoutes } from "./scheduledNotification.route";
import { creditHistoryRoutes } from "./creditHistory.route";
import { leadsRoutes } from "./leads.route";

export const routes = express();

routes.use("/user", userRoutes);
routes.use("/booking", bookingsRoutes);
routes.use("/post", postsRoutes);
routes.use("/review", reviewRoutes);
routes.use("/creditHistory", creditHistoryRoutes);
routes.use("/leads", leadsRoutes);
routes.use("/scheduledNotification", scheduledNotificationRoutes);
