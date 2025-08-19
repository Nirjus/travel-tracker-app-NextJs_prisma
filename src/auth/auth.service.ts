import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // handle new user registration
  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;
    // check if user is exists or not
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      throw new ConflictException(
        'User already exists! Please try with a different email',
      );
    }
    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // create user in the database and return the user object without password
    const newlyCreatedUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    const { password: _, ...result } = newlyCreatedUser;
    return result;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // find currentuser by email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials! try again');
    }

    // verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Wrong password, try again');
    }
    const token = this.jwtService.sign({ userId: user.id });

    const { password: _, ...result } = user;

    return { ...result, token };
  }
}
