import 'express';

declare module 'express' {
  export interface Request {
    user?: any; // หรือใส่แบบเฉพาะ เช่น { id: string }
  }
}
