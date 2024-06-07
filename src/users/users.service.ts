import { Injectable } from '@nestjs/common';
import { PrismaService } from "../../prisma.service";

@Injectable()
export class UsersService {
  constructor(public readonly prismaService: PrismaService) {}

  async resetProblemFlags(): Promise<{ count: number }> {
    return this.prismaService.user.updateMany({
      where: {
        problems: true
      },
      data: {
        problems: false
      }
    });
  }
}
