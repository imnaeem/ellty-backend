import { registerAs } from '@nestjs/config';
import { FieldNames, ModelNames } from 'src/enums';

export const databaseConfig = registerAs('database', () => ({
  // mongoDB connection URI
  connectionURI: process.env.MONGO_CONNECTION_URI,
  /* maps FieldNames enum member -> [graphQL field name, mongoDB field name, ref mongoose model name, is singular field] tuple
   * NOTE: [graphQL field name, mongoDB field name,...] columns in FieldNamesMap must be unique string tokens that map to each other per row
   * and rows with '' model name are for mapping signed URL fields to corresponding path fields in database
   */
  fieldNamesMap: new Map<string, [string, string, string, boolean]>([
    [FieldNames.USERS, ['users', 'userIds', ModelNames.USER, false]],
  ]),
}));
