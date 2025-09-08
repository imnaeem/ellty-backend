import { Schema } from 'mongoose';
import { CollectionNames, FieldNames, ModelNames } from 'src/enums';
import { CommunicationDbObject } from 'src/generated/graphql';
import { addVirtualFieldsToSchema, createSchema, SchemaDefinition } from 'src/utils/schema-helpers';

export const communicationDefinition: SchemaDefinition<CommunicationDbObject> =
  {
    startingNumber: { type: Number, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: ModelNames.USER, required: true },
    title: { type: String },
    currentResult: { type: Number, required: true },
    calculationCount: { type: Number, default: 0 },
    participantCount: { type: Number, default: 1 },
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() },
  };

const CommunicationSchema = createSchema<CommunicationDbObject>(
  communicationDefinition,
  {
    collection: CollectionNames.COMMUNICATION,
  },
);

// Add index for better query performance
CommunicationSchema.index({ createdAt: -1 });
CommunicationSchema.index({ author: 1 });

// Add virtual fields for GraphQL relations
addVirtualFieldsToSchema(CommunicationSchema, [FieldNames.AUTHOR,]);

// Add calculations virtual field with custom foreignField
CommunicationSchema.virtual('calculations', {
  ref: ModelNames.CALCULATION,
  localField: '_id',
  foreignField: 'communicationId',
  justOne: false,
});


export { CommunicationSchema };
