import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(username: string, email: string, password: string) {
    // Verificar si el usuario o email ya existe
    const existingUser = await this.userService.findByUsername(username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const existingEmail = await this.userService.findByEmail(email);
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    const user = await this.userService.create(username, email, password);
    const token = this.generateToken(user);

    return {
      user,
      token,
    };
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);
    return {
      user,
      token,
    };
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.findByUsername(username);
    if (user && (await user.validatePassword(password))) {
      return user;
    }
    return null;
  }

  private generateToken(user: User): string {
    const payload = { username: user.username, sub: user.id };
    return this.jwtService.sign(payload);
  }
} 