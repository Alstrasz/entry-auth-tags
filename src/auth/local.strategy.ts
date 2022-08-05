import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';

@Injectable()
export class LocalStrategy extends PassportStrategy( Strategy ) {
    constructor ( private auth_service: AuthService ) {
        super( {
            usernameField: 'email',
        } );
    }

    async validate ( email: string, password: string ): Promise<User> {
        const user = await this.auth_service.validate_user( { email, password } );
        if ( !user ) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
