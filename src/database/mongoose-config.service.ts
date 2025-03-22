import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import mongooseAutoPopulate from 'mongoose-autopopulate';
import { Injectable } from '@nestjs/common';
import { ApiConfigService } from 'src/shared/services/api-config.service';
import { Connection } from 'mongoose';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private readonly configService: ApiConfigService) {}

  createMongooseOptions():
    | Promise<MongooseModuleOptions>
    | MongooseModuleOptions {
    return {
      uri: this.configService.get('MONGODB_URI'),
      dbName: this.configService.get('MONGODB_DB_NAME'),
      user: this.configService.get('MONGODB_USER'),
      pass: this.configService.get('MONGODB_PASSWORD'),
      connectionFactory(connection): typeof connection {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        connection.plugin(mongooseAutoPopulate);
        return connection;
      },
      onConnectionCreate: (connection: Connection) => {
        connection.on('connected', () => console.log('connected'));
        connection.on('open', () => console.log('open'));
        connection.on('disconnected', () => console.log('disconnected'));
        connection.on('reconnected', () => console.log('reconnected'));
        connection.on('disconnecting', () => console.log('disconnecting'));

        return connection;
      },
    };
  }
}
