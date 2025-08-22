import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as fs from 'fs';

@Injectable()
export class FileUploadService {
  constructor(private prisma: PrismaService) {
    cloudinary.config({
      cloud_name: process.env.CLOUDIBARY_CLOUDE_NAME,
      api_key: process.env.CLOUDINARY_CLOUDE_KEY,
      api_secret: process.env.CLOUDINARY_CLOUDE_SECRET,
    });
  }
  async uploadFile(file: Express.Multer.File, userId: number) {
    try {
      const uploadResult = await this.uploadToCloudinary(file.path);
      const newlySavedFile = await this.prisma.file.create({
        data: {
          filename: file.originalname,
          publicId: uploadResult.public_id,
          url: uploadResult.secure_url,
          userId,
        },
      });
      fs.unlinkSync(file.path);
      return newlySavedFile;
    } catch (error) {
      console.log(error);
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw new InternalServerErrorException(
        `File upload filed Please try again after some time`,
      );
    }
  }

  private async uploadToCloudinary(
    filePath: string,
  ): Promise<UploadApiResponse> {
    return cloudinary.uploader.upload(filePath);
  }

  async deleteFile(fileId: number, userId: number) {
    try {
      const file = await this.prisma.file.findUnique({
        where: {
          id: fileId,
          userId,
        },
      });
      if (!file) {
        throw new NotFoundException('File not found');
      }
      await cloudinary.uploader.destroy(file.publicId);
      await this.prisma.file.delete({
        where: {
          id: fileId,
          userId,
        },
      });
      return {
        message: 'File Deleted successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `File upload filed Please try again after some time`,
      );
    }
  }
}
