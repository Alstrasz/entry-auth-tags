import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello (): string {
        return 'Hello World! More info at https://github.com/Alstrasz/entry-auth-tags';
    }
}
