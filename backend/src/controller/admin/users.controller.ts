import { Request, Response, NextFunction } from 'express';
import * as service from '../../service/admin/users.service';
import { success } from '../../utils/response';

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await service.listUsers(req.query);
    return success(res, users);
  } catch (e) {
    next(e);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await service.getUserById(req.params.id);
    return success(res, user);
  } catch (e) {
    next(e);
  }
}

export async function deactivate(req: Request, res: Response, next: NextFunction) {
  try {
    await service.deactivateUser(req.params.id);
    return success(res, null, 'User deactivated');
  } catch (e) {
    next(e);
  }
}
