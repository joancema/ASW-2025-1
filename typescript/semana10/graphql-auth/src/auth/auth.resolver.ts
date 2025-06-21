import { Resolver, Mutation, Args, ObjectType, Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';

@InputType()
export class RegisterInput {
  @Field()
  @IsString()
  @MinLength(3)
  username: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;
}

@InputType()
export class LoginInput {
  @Field()
  @IsString()
  username: string;

  @Field()
  @IsString()
  password: string;
}

@ObjectType()
export class AuthResponse {
  @Field(() => User)
  user: User;

  @Field()
  token: string;
}

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async register(@Args('input') input: RegisterInput): Promise<AuthResponse> {
    return this.authService.register(input.username, input.email, input.password);
  }

  @Mutation(() => AuthResponse)
  async login(@Args('input') input: LoginInput): Promise<AuthResponse> {
    return this.authService.login(input.username, input.password);
  }
} 