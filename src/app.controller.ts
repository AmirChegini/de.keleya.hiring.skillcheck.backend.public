import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/api/_health')
  health(): string {
    return 'OK';
  }
}
