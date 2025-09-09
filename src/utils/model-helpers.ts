import { Injectable } from '@nestjs/common';
import {
  FilterQuery,
  HydratedDocument,
  Model,
  PopulateOptions,
} from 'mongoose';
import { get } from 'lodash';
import { ConfigHelpers } from './config-helpers';

export type MongoosePopulateOptions = PopulateOptions | string;

@Injectable()
export class ModelHelpers {
  constructor(private readonly configHelpers: ConfigHelpers) {}

  private readonly traverseGraphQLQuery = (
    query: Record<string, any>,
    currentPath: string,
  ): PopulateOptions => {
    const queryValue: Record<string, any> = get(query, currentPath) || {};
    const [selection, nestedFields] = Object.entries(queryValue).reduce(
      (
        [selectionAc, nestedFieldsAc],
        [fieldKey, fieldValue]: [string, Record<string, any>],
      ) =>
        Object.keys(fieldValue).length === 0
          ? // non-nested fields selection (projection)
            [[...selectionAc, fieldKey], nestedFieldsAc]
          : // nested fields population
            [selectionAc, [...nestedFieldsAc, fieldKey]],
      [[], []],
    );
    const path = currentPath.split('.').pop() || '';
    const nextPath = (nestedField) => `${currentPath}.${nestedField}`;
    return {
      path,
      select: [
        // mongoose accepts string type populate that matches .select fields string syntax, i.e. 'client deck' or ['client', 'deck']
        ...selection,
        ...nestedFields.map(
          // real field names for nested populate need to be selected (projected) on this level
          // to deep populate virtual fields in the next level
          (nestedVirtualField) =>
            this.configHelpers.graphQLToMongooseFieldMap[nestedVirtualField],
        ),
      ].join(' '),
      populate: nestedFields.map((nestedField) =>
        this.traverseGraphQLQuery(query, nextPath(nestedField)),
      ),
    };
  };

  private readonly getMongoosePopulateOptions = (
    graphQLQuery,
  ): MongoosePopulateOptions[] => {
    const fieldKeys = Object.entries(graphQLQuery)
      .filter(
        // only virtual fields with nested values need to be populated
        ([, fieldValue]: [string, Record<string, any>]) =>
          Object.keys(fieldValue).length > 0,
      )
      .map(([fieldKey]) => fieldKey);

    // traverse graphQL query
    const options: MongoosePopulateOptions[] = fieldKeys.map(
      (virtualFieldName) =>
        this.traverseGraphQLQuery(graphQLQuery, virtualFieldName),
    );

    return options;
  };

  readonly populateVirtuals = async <
    DocumentType = any,
    PopulateFields = object,
  >(
    documentId: string,
    mongooseModel: Model<HydratedDocument<DocumentType>>,
    graphQLQuery: Record<string, any>,
    mongooseProjection?: string[],
  ) =>
    mongooseModel
      .findById(documentId, mongooseProjection)
      .populate<PopulateFields>(this.getMongoosePopulateOptions(graphQLQuery))
      .exec();

  readonly PopulateVirtual = async <
    DocumentType = any,
    PopulateFields = object,
  >(
    query: any /**null/undefined query returns all documents (mongoose behaviours) */,
    mongooseModel: Model<HydratedDocument<DocumentType>>,
    graphQLQuery: Record<string, any>,
    mongooseProjection?: string[],
  ) =>
    mongooseModel
      .findOne(query, mongooseProjection)
      .populate<PopulateFields>(this.getMongoosePopulateOptions(graphQLQuery))
      .exec();

  readonly queryPopulateVirtuals = async <
    DocumentType = any,
    PopulateFields = object,
  >(
    query: any /**null/undefined query returns all documents (mongoose behaviours) */,
    mongooseModel: Model<HydratedDocument<DocumentType>>,
    graphQLQuery: Record<string, any>,
    mongooseProjection?: string[],
  ) =>
    mongooseModel
      .findOne(query, mongooseProjection)
      .populate<PopulateFields>(this.getMongoosePopulateOptions(graphQLQuery))
      .exec();

  readonly allQueryPopulateVirtuals = async <
    DocumentType = any,
    PopulateFields = object,
  >(
    query: any /**null/undefined query returns all documents (mongoose behaviours) */,
    mongooseModel: Model<HydratedDocument<DocumentType>>,
    graphQLQuery: Record<string, any>,
    mongooseProjection?: string[],
  ) =>
    mongooseModel
      .find(query, mongooseProjection)
      .populate<PopulateFields>(this.getMongoosePopulateOptions(graphQLQuery))
      .exec();

  readonly allPopulateVirtuals = async <
    DocumentType = any,
    PopulateFields = object,
  >(
    mongooseModel: Model<HydratedDocument<DocumentType>>,
    graphQLQuery: Record<string, any>,
    mongooseFilter: FilterQuery<DocumentType>,
    mongooseProjection?: string[],
    shouldReturnLeanResults?: boolean,
    sort?: any,
    skip?: number,
    limit?: number,
  ) => {
    const query = mongooseModel
      .find(mongooseFilter, mongooseProjection)
      .populate<PopulateFields>(this.getMongoosePopulateOptions(graphQLQuery));

    if (sort) {
      query.sort(sort);
    }
    if (skip) {
      query.skip(skip);
    }
    if (limit) {
      query.limit(limit);
    }

    // Return lean results (plain js objects) when we don't need the full Mongoose doc
    // This should typically be used when we're just reading the data
    // and have no need of virtuals.
    // More info about lean here - https://mongoosejs.com/docs/tutorials/lean.html
    if (shouldReturnLeanResults) {
      query.lean();
    }

    return query.exec();
  };
}
