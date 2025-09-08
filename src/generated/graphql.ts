import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AddCalculationInput = {
  communicationId: Scalars['ID']['input'];
  operation: Operation;
  parentCalculationId?: InputMaybe<Scalars['ID']['input']>;
  rightOperand: Scalars['Float']['input'];
};

/** Auth payload for login response */
export type AuthPayload = {
  __typename?: 'AuthPayload';
  /** JWT token */
  token: Scalars['String']['output'];
  /** Authenticated user */
  user: User;
};

/** Single calculation in a communication */
export type Calculation = {
  __typename?: 'Calculation';
  /** User who made this calculation */
  author: User;
  /** Communication this calculation belongs to */
  communication: Communication;
  /** When this calculation was created */
  createdAt: Scalars['String']['output'];
  /** Unique calculation ID */
  id: Scalars['ID']['output'];
  /** Previous number (from parent calculation or starting number) */
  leftOperand: Scalars['Float']['output'];
  /** Operation to perform */
  operation: Operation;
  /** Parent calculation (null for starting number) */
  parentCalculationId?: Maybe<Scalars['ID']['output']>;
  /** Result of the calculation */
  result: Scalars['Float']['output'];
  /** Right operand (user input) */
  rightOperand: Scalars['Float']['output'];
};

/** Communication thread containing calculations */
export type Communication = {
  __typename?: 'Communication';
  /** User who started this communication */
  author: User;
  /** Total number of calculations */
  calculationCount: Scalars['Int']['output'];
  /** All calculations in this communication */
  calculations: Array<Calculation>;
  /** When this communication was created */
  createdAt: Scalars['String']['output'];
  /** Latest result */
  currentResult: Scalars['Float']['output'];
  /** Unique communication ID */
  id: Scalars['ID']['output'];
  /** Number of unique participants */
  participantCount: Scalars['Int']['output'];
  /** Starting number for this communication */
  startingNumber: Scalars['Float']['output'];
  /** Title/description of the communication */
  title?: Maybe<Scalars['String']['output']>;
  /** When this communication was last updated */
  updatedAt: Scalars['String']['output'];
};

export type CreateCommunicationInput = {
  startingNumber: Scalars['Float']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addCalculation: Calculation;
  createCommunication: Communication;
  createUser?: Maybe<User>;
  deleteUser?: Maybe<Scalars['Boolean']['output']>;
  login: AuthPayload;
  register: AuthPayload;
  updateUser?: Maybe<User>;
};


export type MutationAddCalculationArgs = {
  input: AddCalculationInput;
};


export type MutationCreateCommunicationArgs = {
  input: CreateCommunicationInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRegisterArgs = {
  input: CreateUserInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  input: CreateUserInput;
};

/** Math operation enum */
export enum Operation {
  Add = 'ADD',
  Divide = 'DIVIDE',
  Multiply = 'MULTIPLY',
  Subtract = 'SUBTRACT'
}

export type Query = {
  __typename?: 'Query';
  allCommunications: Array<Communication>;
  allUsers: Array<User>;
  communication?: Maybe<Communication>;
  communicationCalculations: Array<Calculation>;
  me?: Maybe<User>;
  user?: Maybe<User>;
};


export type QueryCommunicationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCommunicationCalculationsArgs = {
  communicationId: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  calculationAdded: Calculation;
  communicationCreated: Communication;
  communicationUpdated: Communication;
  userCreated?: Maybe<User>;
};


export type SubscriptionCalculationAddedArgs = {
  communicationId: Scalars['ID']['input'];
};


export type SubscriptionCommunicationUpdatedArgs = {
  communicationId: Scalars['ID']['input'];
};

/** User entity */
export type User = {
  __typename?: 'User';
  /** User creation date */
  createdAt: Scalars['String']['output'];
  /** Unique email */
  email: Scalars['String']['output'];
  /** Unique User ID */
  id: Scalars['ID']['output'];
  /** User active status */
  isActive: Scalars['Boolean']['output'];
  /** User Password */
  password: Scalars['String']['output'];
  /** User last update date */
  updatedAt: Scalars['String']['output'];
  /** Unique username */
  username: Scalars['String']['output'];
};

export type AdditionalEntityFields = {
  path?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AddCalculationInput: AddCalculationInput;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  AuthPayload: ResolverTypeWrapper<AuthPayload>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Calculation: ResolverTypeWrapper<Calculation>;
  Communication: ResolverTypeWrapper<Communication>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  CreateCommunicationInput: CreateCommunicationInput;
  CreateUserInput: CreateUserInput;
  LoginInput: LoginInput;
  Mutation: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Operation: Operation;
  Query: ResolverTypeWrapper<{}>;
  Subscription: ResolverTypeWrapper<{}>;
  User: ResolverTypeWrapper<User>;
  AdditionalEntityFields: AdditionalEntityFields;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AddCalculationInput: AddCalculationInput;
  ID: Scalars['ID']['output'];
  Float: Scalars['Float']['output'];
  AuthPayload: AuthPayload;
  String: Scalars['String']['output'];
  Calculation: Calculation;
  Communication: Communication;
  Int: Scalars['Int']['output'];
  CreateCommunicationInput: CreateCommunicationInput;
  CreateUserInput: CreateUserInput;
  LoginInput: LoginInput;
  Mutation: {};
  Boolean: Scalars['Boolean']['output'];
  Query: {};
  Subscription: {};
  User: User;
  AdditionalEntityFields: AdditionalEntityFields;
};

export type UnionDirectiveArgs = {
  discriminatorField?: Maybe<Scalars['String']['input']>;
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type UnionDirectiveResolver<Result, Parent, ContextType = any, Args = UnionDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AbstractEntityDirectiveArgs = {
  discriminatorField: Scalars['String']['input'];
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type AbstractEntityDirectiveResolver<Result, Parent, ContextType = any, Args = AbstractEntityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EntityDirectiveArgs = {
  embedded?: Maybe<Scalars['Boolean']['input']>;
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type EntityDirectiveResolver<Result, Parent, ContextType = any, Args = EntityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ColumnDirectiveArgs = {
  overrideType?: Maybe<Scalars['String']['input']>;
};

export type ColumnDirectiveResolver<Result, Parent, ContextType = any, Args = ColumnDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type IdDirectiveArgs = { };

export type IdDirectiveResolver<Result, Parent, ContextType = any, Args = IdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type LinkDirectiveArgs = {
  overrideType?: Maybe<Scalars['String']['input']>;
};

export type LinkDirectiveResolver<Result, Parent, ContextType = any, Args = LinkDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EmbeddedDirectiveArgs = { };

export type EmbeddedDirectiveResolver<Result, Parent, ContextType = any, Args = EmbeddedDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type MapDirectiveArgs = {
  path: Scalars['String']['input'];
};

export type MapDirectiveResolver<Result, Parent, ContextType = any, Args = MapDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AuthPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthPayload'] = ResolversParentTypes['AuthPayload']> = {
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CalculationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Calculation'] = ResolversParentTypes['Calculation']> = {
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  communication?: Resolver<ResolversTypes['Communication'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  leftOperand?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  operation?: Resolver<ResolversTypes['Operation'], ParentType, ContextType>;
  parentCalculationId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  result?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  rightOperand?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommunicationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Communication'] = ResolversParentTypes['Communication']> = {
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  calculationCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  calculations?: Resolver<Array<ResolversTypes['Calculation']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentResult?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  participantCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  startingNumber?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addCalculation?: Resolver<ResolversTypes['Calculation'], ParentType, ContextType, RequireFields<MutationAddCalculationArgs, 'input'>>;
  createCommunication?: Resolver<ResolversTypes['Communication'], ParentType, ContextType, RequireFields<MutationCreateCommunicationArgs, 'input'>>;
  createUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  deleteUser?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'id'>>;
  login?: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'input'>>;
  register?: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, RequireFields<MutationRegisterArgs, 'input'>>;
  updateUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'id' | 'input'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  allCommunications?: Resolver<Array<ResolversTypes['Communication']>, ParentType, ContextType>;
  allUsers?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  communication?: Resolver<Maybe<ResolversTypes['Communication']>, ParentType, ContextType, RequireFields<QueryCommunicationArgs, 'id'>>;
  communicationCalculations?: Resolver<Array<ResolversTypes['Calculation']>, ParentType, ContextType, RequireFields<QueryCommunicationCalculationsArgs, 'communicationId'>>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  calculationAdded?: SubscriptionResolver<ResolversTypes['Calculation'], "calculationAdded", ParentType, ContextType, RequireFields<SubscriptionCalculationAddedArgs, 'communicationId'>>;
  communicationCreated?: SubscriptionResolver<ResolversTypes['Communication'], "communicationCreated", ParentType, ContextType>;
  communicationUpdated?: SubscriptionResolver<ResolversTypes['Communication'], "communicationUpdated", ParentType, ContextType, RequireFields<SubscriptionCommunicationUpdatedArgs, 'communicationId'>>;
  userCreated?: SubscriptionResolver<Maybe<ResolversTypes['User']>, "userCreated", ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  password?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AuthPayload?: AuthPayloadResolvers<ContextType>;
  Calculation?: CalculationResolvers<ContextType>;
  Communication?: CommunicationResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = any> = {
  union?: UnionDirectiveResolver<any, any, ContextType>;
  abstractEntity?: AbstractEntityDirectiveResolver<any, any, ContextType>;
  entity?: EntityDirectiveResolver<any, any, ContextType>;
  column?: ColumnDirectiveResolver<any, any, ContextType>;
  id?: IdDirectiveResolver<any, any, ContextType>;
  link?: LinkDirectiveResolver<any, any, ContextType>;
  embedded?: EmbeddedDirectiveResolver<any, any, ContextType>;
  map?: MapDirectiveResolver<any, any, ContextType>;
};

import { Types } from 'mongoose';
export type CalculationDbObject = {
  authorId: UserDbObject['_id'],
  communicationId: CommunicationDbObject['_id'],
  createdAt: string,
  _id: Types.ObjectId,
  leftOperand: number,
  operation: string,
  parentCalculationId?: Maybe<string>,
  result: number,
  rightOperand: number,
};

export type CommunicationDbObject = {
  authorId: UserDbObject['_id'],
  calculationCount: number,
  calculationIds: Array<CalculationDbObject['_id']>,
  createdAt: string,
  currentResult: number,
  _id: Types.ObjectId,
  participantCount: number,
  startingNumber: number,
  title?: Maybe<string>,
  updatedAt: string,
};

export type UserDbObject = {
  createdAt: string,
  email: string,
  _id: Types.ObjectId,
  isActive: boolean,
  password: string,
  updatedAt: string,
  username: string,
};
