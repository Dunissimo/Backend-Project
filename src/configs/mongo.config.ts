import { ConfigService } from '@nestjs/config';
import { TypegooseModuleOptions } from 'nestjs-typegoose';

export const getMongoConfig = async (
  configService: ConfigService,
): Promise<TypegooseModuleOptions> => {
  return {
    uri: getMongoString(configService),
    ...getMongoOptions(),
  };
};

const getMongoString = (configService: ConfigService) => {
  const login = configService.get('MONGO_LOGIN');
  const pass = configService.get('MONGO_PASS');
  const host = configService.get('MONGO_HOST');
  const port = configService.get('MONGO_PORT');
  const authDB = configService.get('MONGO_AUTH_DB');

  return `mongodb://${login}:${pass}@${host}:${port}/${authDB}`;
};

const getMongoOptions = () => ({});
