import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigHelpers {
  constructor(private readonly config: ConfigService) {}

  // map graphQL field name -> real field name in mongoDB
  readonly graphQLToMongooseFieldMap: Record<string, string> =
    Object.fromEntries(
      [
        ...(
          this.config.get<Map<string, [string, string, string, boolean]>>(
            'database.fieldNamesMap',
          ) || new Map<string, [string, string, string, boolean]>()
        ).values(),
      ].map(([virtualFieldName, realFieldName]) => [
        virtualFieldName,
        realFieldName,
      ]),
    );
}
