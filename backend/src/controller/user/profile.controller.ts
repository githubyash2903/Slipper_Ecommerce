import { Request, Response, NextFunction } from 'express';
import * as service from '../../service/user/profile.service'; 
import { success } from '../../utils/response';
import { updateProfileSchema, addressSchema } from '../../validation/user/profile.schema';


export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id || (req as any).user.sub;
    const profile = await service.getProfile(userId);
    return success(res, profile);
  } catch (e) {
    next(e);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id || (req as any).user.sub;
    const payload = updateProfileSchema.parse(req.body);
    
    const updatedProfile = await service.updateProfile(userId, {
      name: payload.name,
      phone: payload.phone 
    });

    return success(res, updatedProfile, 'Profile updated');
  } catch (e) {
    next(e);
  }
}

export async function getAddresses(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id || (req as any).user.sub;
    const addresses = await service.getAddresses(userId);
    return success(res, addresses);
  } catch (e) {
    next(e);
  }
}

export async function addAddress(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id || (req as any).user.sub;
    const payload = addressSchema.parse(req.body);
    const newAddress = await service.addAddress(userId, payload);
    return success(res, newAddress, 'Address added');
  } catch (e) {
    next(e);
  }
}

export async function deleteAddress(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id || (req as any).user.sub;
    const { id } = req.params;
    await service.deleteAddress(userId, id);
    return success(res, null, 'Address deleted');
  } catch (e) {
    next(e);
  }
}
