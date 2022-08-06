import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { jwt_constants } from './constants';
import { JwtPayload } from './interfaces/jwt_payload';


/**
 * Validates JWT bearer token and assigns User to request.user
 *
 * @export
 * @class JwtStrategy
 * @extends {PassportStrategy( Strategy, 'jwt' )}
 */
@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy, 'jwt' ) {
    constructor (
        private users_serivce: UsersService,
    ) {
        super( {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwt_constants.SECRET_KEY,
        } );
    }

    async validate ( payload: JwtPayload ) {
        const user = await this.users_serivce.get_by_id( payload.sub )
            .catch( ( err ) => {
                console.log( err ); // to remove
                throw new UnauthorizedException( { description: 'Jwt strategy: needs more description' } );
            } );
        return user;
    }
}

/**
 * Validates JWT bearer token and assigns UserWithAssignedTags to request.user
 *
 * @export
 * @class JwtStrategyUserWithTags
 * @extends {PassportStrategy( Strategy, 'jwt-user-with-tags' )}
 */
@Injectable()
export class JwtStrategyUserWithTags extends PassportStrategy( Strategy, 'jwt-user-with-tags' ) {
    constructor (
        private users_serivce: UsersService,
    ) {
        super( {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwt_constants.SECRET_KEY,
        } );
    }

    async validate ( payload: JwtPayload ) {
        const user = await this.users_serivce.get_by_id( payload.sub, true )
            .catch( ( err ) => {
                console.log( err ); // to remove
                throw new UnauthorizedException( { description: 'Jwt strategy: needs more description' } );
            } );
        return user;
    }
}
