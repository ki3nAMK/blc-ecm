import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { loadConfiguration } from './configs/app.config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/entities/user.entity';
import { Session, SessionSchema } from './models/entities/session.entity';
import { redisStore } from 'cache-manager-ioredis-yet';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppClassSerializerInterceptor } from './interceptors/mongo-class-serializer.interceptor';
import AppLoggerService from './services/app-logger.service';
import { UsersRepository } from './models/repos/user.repo';
import { SessionsRepository } from './models/repos/session.repo';
import { CacheDomain } from './services/cache.service';
import { SessionService } from './services/session.service';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/user.service';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { JwtAccessTokenStrategy, JwtRefreshTokenStrategy } from './strategies';
import { ProductReviewsRepository } from './models/repos/product-review.repo';
import { ProductsRepository } from './models/repos/product.repo';
import { Product, ProductSchema } from './models/entities/product.entity';
import {
  ProductReview,
  ProductReviewSchema,
} from './models/entities/product-review.entity';
import { SeedProductsService } from './services/seed-product.service';
import { Order, OrderSchema } from './models/entities/order.entity';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { FlashSaleCronService } from './services/flash-sale-cron.service';
import { ClientGateway } from './gateways/client.gateway';
import { OrdersService } from './services/order.service';
import { OrdersRepository } from './models/repos/order.repo';
import { OrdersController } from './controllers/order.controller';
import { BlockchainService } from './services/blockchain.service';
import {
  AirdropCampaign,
  AirdropCampaignSchema,
} from './models/entities/airdrop-campaign.entity';
import { AirdropCampaignsRepository } from './models/repos/airdrop-campaign.repo';
import { AirdropService } from './services/airdrop.service';
import {
  AdminAirdropController,
  AirdropController,
} from './controllers/airdrop.controller';
import { ProductReviewsService } from './services/product-review.service';
import { Blog, BlogSchema } from './models/entities/blog.entity';
import { BlogsRepository } from './models/repos/blog.repo';
import { BlogService } from './services/blog.service';
import { AdminBlogController, BlogController } from './controllers/blog.controller';
import { ShopController } from './controllers/shop.controller';
import { ShopService } from './services/shop.service';
import { Conversation, ConversationSchema } from './models/entities/conversation.entity';
import { Message, MessageSchema } from './models/entities/message.entity';
import { ConversationsRepository } from './models/repos/conversation.repo';
import { MessagesRepository } from './models/repos/message.repo';
import { ConversationsController } from './controllers/conversation.controller';
import { ConversationsService } from './services/conversation.service';
import { SellerGateway } from './gateways/seller.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [() => loadConfiguration()],
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const { uri } = configService.get('mongo');
        return { uri };
      },
    }),

    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Session.name,
        schema: SessionSchema,
      },
      {
        name: Product.name,
        schema: ProductSchema,
      },
      {
        name: ProductReview.name,
        schema: ProductReviewSchema,
      },
      {
        name: Order.name,
        schema: OrderSchema,
      },
      {
        name: AirdropCampaign.name,
        schema: AirdropCampaignSchema,
      },
      {
        name: Blog.name,
        schema: BlogSchema,
      },
      {
        name: Conversation.name,
        schema: ConversationSchema,
      },
      {
        name: Message.name,
        schema: MessageSchema,
      },
    ]),

    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const { host, port, database, password } = configService.get('redis');
        return {
          store: redisStore,
          host,
          port,
          db: database,
          password,
          ttl: 0,
        };
      },
    }),

    PassportModule.register({}),
    JwtModule.register({}),
    ScheduleModule.forRoot(),

    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      maxListeners: 10,
    }),

    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60 * 1000,
          limit: 10,
        },
      ],
    }),
  ],
  controllers: [
    AuthController,
    UserController,
    ProductController,
    OrdersController,
    AdminAirdropController,
    AirdropController,
    BlogController,
    AdminBlogController,
    ShopController,
    ConversationsController,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: AppClassSerializerInterceptor },

    AppLoggerService,

    // * services
    CacheDomain,
    SessionService,
    AuthService,
    UsersService,
    SeedProductsService,
    ProductService,
    OrdersService,
    BlockchainService,
    AirdropService,
    ProductReviewsService,
    BlogService,
    FlashSaleCronService,
    ShopService,
    ConversationsService,

    // * repos
    UsersRepository,
    SessionsRepository,
    ProductReviewsRepository,
    ProductsRepository,
    OrdersRepository,
    AirdropCampaignsRepository,
    BlogsRepository,
    ConversationsRepository,
    MessagesRepository,

    // * strategies
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,

    // * gateways
    ClientGateway,
    SellerGateway,
  ],
})
export class AppModule {}
