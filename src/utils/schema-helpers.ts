import {
  Document,
  Schema,
  SchemaDefinition as MongooseSchemaDefinition,
  SchemaDefinitionType,
  SchemaOptions,
} from 'mongoose';
import { databaseConfig } from 'src/config/database.config';

export type GqlToMongoose<T> = Omit<
  T,
  keyof Document | 'updatedAt' | 'createdAt' | '__typename'
>;

export type SchemaDefinition<T> = MongooseSchemaDefinition<
  SchemaDefinitionType<T>
>;

export function createSchema<T>(
  definition: SchemaDefinition<T>,
  options?: SchemaOptions,
) {
  return new Schema<GqlToMongoose<T>>(definition, options as Schema);
}

export const addVirtualFieldsToSchema = (
  schema: Schema<GqlToMongoose<any>>,
  fieldNames: string[],
  foreignField = '_id',
) =>
  fieldNames.forEach((fieldName) => {
    const [virtualFieldName, realFieldName, modelName, justOne] =
      databaseConfig().fieldNamesMap.get(fieldName) || [];
    if (!(virtualFieldName && realFieldName && modelName)) return;
    schema.virtual(virtualFieldName, {
      ref: modelName,
      localField: realFieldName,
      foreignField,
      justOne,
    });
  });

const populateId = (response: any, isLean?: boolean) => {
  if (!response || !isLean) {
    return;
  }
  if (Array.isArray(response)) {
    for (const responseItem of response) {
      responseItem.id = responseItem._id;
    }
  }
};

// When we use lean() for performance gains on reads,
// we lose id because id is a getter that converts _id to string.
// To keep this on lean, populate id after a find.
// More info about lean here - https://mongoosejs.com/docs/tutorials/lean.html
export const populateLeanId = (schema: Schema) => {
  schema.post(['find', 'findOne'], function (response) {
    populateId(response, !!this.mongooseOptions().lean);
  });
};

// Use this plugin to debug execution times of find queries
//  e.g. RoleSchema.plugin(logFindExecutionTimes(ModelNames.ROLE));
export const logFindExecutionTimes =
  (schemaName: string) => (schema: Schema) => {
    schema.pre('find', function () {
      console.time(`>>>>>>>>>>>>>>>>> ${schemaName} find`);
    });

    schema.post('find', function () {
      console.timeEnd(`>>>>>>>>>>>>>>>>> ${schemaName} find`);
    });
  };
