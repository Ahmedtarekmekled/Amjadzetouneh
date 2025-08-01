import path from 'path';
import { Request, Response } from 'express';

export const downloadFile = (req: Request, res: Response) => {
  try {
    const filePath = path.join(__dirname, '../../public/uploads', req.params.filename);
    res.download(filePath, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(404).json({ message: 'File not found' });
      }
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Error downloading file' });
  }
}; 