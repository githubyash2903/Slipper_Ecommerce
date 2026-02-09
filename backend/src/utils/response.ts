import { Response } from 'express';

export function success(res: Response, data: any, message = 'OK') {
  return res.json({ success: true, message, data });
}

export function error(res: Response, message: string, status = 400) {
  return res.status(status).json({ success: false, message });
}
