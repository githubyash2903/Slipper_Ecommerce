import { Router } from "express";
// ✅ Import getProfile here
import { login, register, registerAdminController, getProfile } from "../../controller/auth.controller";
// ✅ Import Middleware (Path check kar lein, usually ../middleware hota hai)
import { authenticate } from "../../middleware/auth"; 

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/register/admin', registerAdminController);
authRouter.post('/login', login);


export default authRouter;