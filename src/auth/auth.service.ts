import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  // handle new user registration
  async register() {
    // check if user is exists or not
    // hash the password
    // create password from the return object
  }
}
