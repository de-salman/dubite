import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterDto {

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;
    
    @IsString()
    @IsNotEmpty()
    name: string;


    @IsString()
    @IsNotEmpty()
    auth_provider: string;

    @IsOptional()
    @IsString()
    avatar_url?: string;

    @IsString()
    @IsNotEmpty()
    city_id: string;
}