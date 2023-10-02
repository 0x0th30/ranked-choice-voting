import { PrismaClient } from '@prisma/client';
import { RedisClient } from '@loaders/redis';
import { WriteThrough } from '@repositories/write-through';
import { transporter } from '@loaders/mail-transporter';
import { MailSender } from './mail-sender';
import { VoteProcessor } from './vote-processor';

const WriteThroughManager = new WriteThrough(new PrismaClient(), RedisClient as any);

new VoteProcessor(WriteThroughManager).start();
new MailSender(transporter).start();
