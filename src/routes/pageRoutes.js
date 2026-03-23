import { Router } from "express";
import { 
    homePage, 
    aboutPage, 
    faqPage, 
    termsPage 
} from "../controllers/index.js";

const pageRoutes = Router();

pageRoutes.get("/", homePage);
pageRoutes.get("/about", aboutPage);
pageRoutes.get("/faq", faqPage);
pageRoutes.get("/terms", termsPage);

export default pageRoutes;
