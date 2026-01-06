import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}

    async register(registerDto: RegisterDto) {
        const { email, password, name, auth_provider, avatar_url, city_id } = registerDto;
      
        try {
          const user = await this.prisma.user.create({
            data: {
              email,
              password: await bcrypt.hash(password, 10),
              name,
              auth_provider,
              avatar_url,
              city: { connect: { id: city_id } } // automatically checks city exists
            }
          });
      
          const {password: _, ...userWithoutPassword} = user; 
          return userWithoutPassword;
      
        } catch (error) {
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
              // Unique constraint failed
              throw new BadRequestException('User already exists');
            }
            if (error.code === 'P2025') {
                // Foreign key not found (invalid city_id)        
              throw new BadRequestException('City not found');
            }
          }
          throw error;
        }
    }

    async validateUser(email: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const {password:_, ...result } = user;
        return result;
    }

    async login(user: {id: string, email: string, role: string}) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        const access_token = await this.jwtService.signAsync(payload,
            {expiresIn: '1h'}
        );

        const refresh_token = await this.jwtService.signAsync(payload,
            {expiresIn: '7d'}
        );

        return { access_token, refresh_token };
    }

    verifyToken(token:string) {
        try {
            return this.jwtService.verify(token, {secret: process.env.JWT_SECRET })
        } catch (error) {
            throw new UnauthorizedException('Invalid token')
        }
    }

    async findUserById(userId: string) {
        return this.prisma.user.findUnique({
          where: { id: userId },
        });
    }

}
