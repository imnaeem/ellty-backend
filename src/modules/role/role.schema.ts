import { RoleDbObject } from 'src/generated/graphql';
import { CollectionNames, FieldNames, ModelNames } from 'src/enums';
import {
  addVirtualFieldsToSchema,
  createSchema,
  SchemaDefinition,
} from 'src/utils/schema-helpers';
import { Schema } from 'mongoose';

export const roleDefinition: SchemaDefinition<RoleDbObject> = {
  name: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  userIds: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: ModelNames.USER,
      default: [],
    },
  ],
};

const RoleSchema = createSchema<RoleDbObject>(roleDefinition, {
  timestamps: true,
  collection: CollectionNames.ROLE,
});

addVirtualFieldsToSchema(RoleSchema, [FieldNames.USERS]);

export { RoleSchema };
