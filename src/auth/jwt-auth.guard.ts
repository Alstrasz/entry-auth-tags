import { CanActivate, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';


/**
 * Validates JWT bearer token and assigns User to request.user
 *
 * @class JwtAuthGuardWithoutTags
 * @extends {AuthGuard( 'jwt' )}
 */
@Injectable()
class JwtAuthGuardWithoutTags extends AuthGuard( 'jwt' ) {}


/**
 * Validates JWT bearer token and assigns UserWithAssignedTags to request.user
 *
 * @class JwtAuthGuardWithTags
 * @extends {AuthGuard( 'jwt-user-with-tags' )}
 */
@Injectable()
class JwtAuthGuardWithTags extends AuthGuard( 'jwt-user-with-tags' ) {}


/**
 * Validates JWT bearer token and assigns to request.user UserWithAssignedTags if with_tags, else User
 *
 * @export
 * @class JwtAuthGuard
 * @implements {CanActivate}
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor ( with_tags: boolean = false ) {
        if ( with_tags ) {
            return new JwtAuthGuardWithTags() as any;
        } else {
            return new JwtAuthGuardWithoutTags() as any;
        }
    }

    canActivate (): boolean | Promise<boolean> | Observable<boolean> {
        throw new UnauthorizedException( 'Guard used without calling constructor' );
    }
}
