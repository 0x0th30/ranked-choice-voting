import { PrismaClient } from '@prisma/client';

export const PrismaMock = {
  voting: {
    create: jest.spyOn(new PrismaClient().voting, 'create'),
  },
};
