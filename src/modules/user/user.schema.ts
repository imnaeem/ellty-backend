import { CollectionNames } from 'src/enums';
import { UserDbObject } from 'src/generated/graphql';
import { createSchema, SchemaDefinition } from 'src/utils/schema-helpers';

export const userDefinition: SchemaDefinition<UserDbObject> = {
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
};

const UserSchema = createSchema<UserDbObject>(userDefinition, {
  collection: CollectionNames.USER,
});

export { UserSchema };
