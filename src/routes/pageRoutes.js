import { Router } from "express";
import { homePage, aboutPage, faqPage } from "../controllers/index.js";

const pageRoutes = Router();

pageRoutes.get("/", homePage);
pageRoutes.get("/about", aboutPage);
pageRoutes.get("/faq", faqPage);

export default pageRoutes;
