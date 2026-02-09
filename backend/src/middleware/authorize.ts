import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export function authorize(allowedRoles: Array<'USER' | 'ADMIN'>) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {

    
    //  Check if user exists
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

 
    const userRole = req.user.role.toUpperCase() as 'USER' | 'ADMIN';


    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient Permissions' });
    }

    next();
  };
}