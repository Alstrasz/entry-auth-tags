import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwt_constants } from './constants';
import { JwtStrategy, JwtStrategyUserWithTags } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module( {
    imports: [
        forwardRef( () => UsersModule ),
        PassportModule,
        JwtModule.register( {
            secret: jwt_constants.SECRET_KEY,
            signOptions: { expiresIn: jwt_constants.EXPIRE_TIME },
        } ),
    ],
    providers: [
        AuthService,
        JwtStrategy,
        LocalStrategy,
        JwtStrategyUserWithTags,
    ],
    controllers: [AuthController],
    exports: [AuthService],
} )
export class AuthModule {}
