import { Payload } from 'payload';
import { handleBulkImport } from './bulk-import';

export const registerEndpoints = (payload: Payload) => {
  // Register bulk import endpoint
  payload.express.post(
    '/api/bulk-imports',
    payload.authenticate,
    async (req: any, res: any) => {
      // Set the user on the request for proper permissions checking
      req.user = req.user || null;
      req.payload = payload;
      
      return handleBulkImport(req, res);
    }
  );
};

export default registerEndpoints;
