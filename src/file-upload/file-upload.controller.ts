import {
  Controller,
  Delete,
  Param,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGaurd } from 'src/auth/jwt-auth.guard';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

interface Requests extends Request {
  user: { userId: number };
}

@Controller('file-upload')
@UseGuards(JwtAuthGaurd)
export class FileUploadController {
  constructor(private readonly fileService: FileUploadService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqeSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqeSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadImage(
    @Request()
    req: Requests,

    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return await this.fileService.uploadFile(file, req.user.userId);
  }

  @Delete(':id')
  async deleteFile(
    @Param('id')
    id: string,

    @Request()
    req: Requests,
  ) {
    return await this.fileService.deleteFile(+id, req.user.userId);
  }
}
