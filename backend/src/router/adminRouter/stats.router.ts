import { Router } from "express";
import * as controller from "../../controller/admin/stats.controller";

const statsRouter = Router();
statsRouter.get("/", controller.getDashboardData);

export default statsRouter;


