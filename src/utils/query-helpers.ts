import {
  FragmentDefinitionNode,
  GraphQLResolveInfo,
  InlineFragmentNode,
  SelectionNode,
  SelectionSetNode,
} from 'graphql';
import { Injectable } from '@nestjs/common';
import { ConfigHelpers } from './config-helpers';

@Injectable()
export class QueryHelpers {
  constructor(private readonly configHelpers: ConfigHelpers) {}

  private collectFieldNames = (
    selectionSet: SelectionSetNode | undefined,
    fragments: Record<string, FragmentDefinitionNode>,
  ): string[] => {
    if (!selectionSet) return [];

    const collected = new Set<string>();

    const visit = (selections: readonly SelectionNode[]) => {
      for (const selection of selections) {
        if (selection.kind === 'Field') {
          const name = selection.name.value;
          if (name !== '__typename') collected.add(name);
        } else if (selection.kind === 'FragmentSpread') {
          const fragment = fragments[selection.name.value];
          if (fragment) visit(fragment.selectionSet.selections);
        } else if (selection.kind === 'InlineFragment') {
          const inline = selection as InlineFragmentNode;
          if (inline.selectionSet) visit(inline.selectionSet.selections);
        }
      }
    };

    visit(selectionSet.selections);

    return Array.from(collected);
  };

  readonly getProjectionFromInfo = (info: GraphQLResolveInfo) =>
    this.collectFieldNames(info.fieldNodes[0]?.selectionSet, info.fragments).map(
      (value): string =>
        Object.prototype.hasOwnProperty.call(
          this.configHelpers.graphQLToMongooseFieldMap,
          value,
        )
          ? this.configHelpers.graphQLToMongooseFieldMap[value]
          : value,
    );
}
