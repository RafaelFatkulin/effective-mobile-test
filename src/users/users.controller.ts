import { Controller, Put } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('/reset-problem-flags')
  resetProblemFlags() {
    return this.usersService.resetProblemFlags();
  }
}
