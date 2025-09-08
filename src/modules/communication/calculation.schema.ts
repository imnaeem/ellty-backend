import { Schema } from 'mongoose';
import { CollectionNames, FieldNames, ModelNames } from 'src/enums';
import { CalculationDbObject } from 'src/generated/graphql';
import { addVirtualFieldsToSchema, createSchema, SchemaDefinition } from 'src/utils/schema-helpers';
import { Operation } from 'src/generated/graphql';

export const calculationDefinition: SchemaDefinition<CalculationDbObject> = {
  leftOperand: { type: Number, required: true },
  operation: {
    type: String,
    enum: Object.values(Operation),
    required: true,
  },
  authorId: { type: Schema.Types.ObjectId, ref: ModelNames.USER, required: true },
  communicationId: {
    type: Schema.Types.ObjectId,
    ref: ModelNames.COMMUNICATION,
    required: true,
  },
  parentCalculationId: { type: String },
  rightOperand: { type: Number, required: true },
  result: { type: Number, required: true },
  createdAt: { type: String, default: () => new Date().toISOString() },
};

const CalculationSchema = createSchema<CalculationDbObject>(
  calculationDefinition,
  {
    collection: CollectionNames.CALCULATION,
  },
);

// Add indexes for better query performance
CalculationSchema.index({ communicationId: 1, createdAt: 1 });
CalculationSchema.index({ authorId: 1 });
CalculationSchema.index({ parentCalculationId: 1 });

// Add virtual fields for GraphQL relations
addVirtualFieldsToSchema(CalculationSchema, [
  FieldNames.AUTHOR, 
  FieldNames.COMMUNICATION,
  FieldNames.PARENT_CALCULATION
]);

// Ensure virtuals are included in JSON output
CalculationSchema.set('toJSON', { virtuals: true });
CalculationSchema.set('toObject', { virtuals: true });

export { CalculationSchema };
