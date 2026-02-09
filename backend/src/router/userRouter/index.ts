import { Router } from "express";
import { login, register, registerAdminController } from "../../controller/auth.controller";
import orderRouter from "./order.router";
import cartRouter from "./cart.router";
import productRouter from "./product.router";
import profileRouter from "./profile.router";
import wishlistRouter from "./wishlist.router";


const authRouter = Router();

// authRouter.post('/register', register);
// authRouter.post('/register/admin', registerAdminController);
// authRouter.post('/login', login);

authRouter.use('/order' , orderRouter);
authRouter.use('/cart' , cartRouter);
authRouter.use('/product' , productRouter);
authRouter.use('/profile' , profileRouter);
authRouter.use('/wishlist' , wishlistRouter);
export default authRouter;
