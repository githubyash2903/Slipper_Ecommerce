import { Router } from 'express';
import userRouter from './users.router';
import statsRouter from './stats.router';
import orderRouter from './order.router';
import productRouter from './product.router';
import employeeRouter from './employee.router';
import stockRouter from './stock.router';
import settingsRouter from './settings.router';


const adminRouter = Router();

adminRouter.use('/users', userRouter);
adminRouter.use('/stats', statsRouter);

adminRouter.use("/order" , orderRouter);
adminRouter.use("/product" , productRouter);
adminRouter.use("/employees" , employeeRouter);
adminRouter.use("/stock" , stockRouter);
adminRouter.use("/settings" , settingsRouter);





export default adminRouter;
