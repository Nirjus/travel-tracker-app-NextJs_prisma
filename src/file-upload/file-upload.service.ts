import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { v2 as cloudinary } from 'cloudinary';
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

  async uploadFile(file: Express.Multer.File) {
    try {
      const uploadResult = await this.uploadToCloudinary(file.path);
      const newlySavedFile = await this.prisma.file.create({
        data: {
          filename: file.originalname,
          publicId: uploadResult.public_id,
          url: uploadResult.secure_url,
        },
      });
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

  private uploadToCloudinary(filePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(filePath, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }
}
