import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingsModule } from './modules/bookings/bookings.module';
import { FlightsModule } from './modules/flights/flights.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
    }),

    // Configure Keyv-based Redis dynamically
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<string>('REDIS_HOST', 'localhost');
        const port = configService.get<number>('REDIS_PORT', 6379);
        const password = configService.get<string>('REDIS_PASSWORD', '');

        // Build connection URI: redis://[:password@]host:port
        const redisUri = password
          ? `redis://:${password}@${host}:${port}`
          : `redis://${host}:${port}`;

        return {
          stores: [
            createKeyv(redisUri, {
              namespace: 'flights-app', // Keeps your Redis keys separated
              useUnlink: true, // Optimizes deletes for larger datasets
            }),
          ],
          // Default TTL in milliseconds (e.g., 15 minutes)
          ttl: configService.get<number>('REDIS_TTL', 900000),
        };
      },
    }),

    FlightsModule,
    BookingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
