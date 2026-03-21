import { Router } from "express";
import { 
    showEditAccountForm, 
    showAllUsers, 
    processEditAccount,
    showAdminView
} from "../controllers/admin/admin.js";
import { requireRole } from "../middleware/auth.js";

const adminRoutes = Router();

// Add specific styles to admin page
adminRoutes.use('/admin', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/admin.css">');
    next();
});

adminRoutes.get("/admin", requireRole('admin'), showAdminView);
//admin view will have links to see current rentals, all rentals, and user edit page
adminRoutes.get("/admin/users", requireRole('admin'), showAllUsers);
adminRoutes.get("/admin/users/:id/edit", requireRole('admin'), showEditAccountForm);
adminRoutes.post("/admin/users:id/edit", requireRole('admin'), processEditAccount)

export default adminRoutes;