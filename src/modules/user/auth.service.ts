import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { CreateUserInput, LoginInput, AuthPayload } from 'src/generated/graphql';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(input: CreateUserInput): Promise<AuthPayload> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }
    const existingUserByUsername = await this.userRepository.findByUsername(input.username);
    if (existingUserByUsername) {
      throw new UnauthorizedException('User with this username already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(input.password, 12);
    
    // Create user with hashed password
    const user = await this.userRepository.createNewUser({
      ...input,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = this.generateToken(user.id, user.email);

    return {
      token,
      user,
    };
  }

  async login(input: LoginInput): Promise<AuthPayload> {
    // Find user by email or username
    const user = await this.userRepository.findByEmailOrUsername(input.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Generate JWT token
    const token = this.generateToken(user.id, user.email);

    return {
      token,
      user,
    };
  }

  async validateUser(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }
    return user;
  }

  private generateToken(userId: string, email: string): string {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload);
  }
}
