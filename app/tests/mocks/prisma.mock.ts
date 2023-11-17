import { PrismaClient } from '@prisma/client';

export const PrismaMock = {
  voting: {
    create: jest.spyOn(new PrismaClient().voting, 'create'),
    findFirst: jest.spyOn(new PrismaClient().voting, 'findFirst'),
  },
  vote: {
    create: jest.spyOn(new PrismaClient().vote, 'create'),
    findFirst: jest.spyOn(new PrismaClient().vote, 'findFirst'),
  },
  user: {
    create: jest.spyOn(new PrismaClient().user, 'create'),
    findFirst: jest.spyOn(new PrismaClient().user, 'findFirst'),
  },
};
