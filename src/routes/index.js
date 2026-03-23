import { Router } from "express";
import pageRoutes from "./pageRoutes.js";
import authRoutes from "./authRoutes.js";
import rentalRoutes from "./rentalRoutes.js";
import adminRoutes from "./admin.js";

const routes = Router();

routes.use(pageRoutes);
routes.use(authRoutes);
routes.use(rentalRoutes);
routes.use(adminRoutes);

export default routes;
