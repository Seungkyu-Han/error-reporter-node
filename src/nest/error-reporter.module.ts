import { DynamicModule, Module, Provider } from '@nestjs/common';
import { SlackClient } from '../core/slack-client';
import { SLACK_CLIENT } from './error-reporter.token';
import { ErrorReporterFilter } from './error-reporter.filter';
import { APP_FILTER } from '@nestjs/core';
import { ErrorReporterOptions } from '../types/error-reporter.option';
import { ErrorReporterAsyncOptions } from '../types/error-reporter.async.option';
import { ErrorMessageFormatterHelper } from '../core/helper/error-message-formatter.helper';

@Module({})
export class ErrorReporterModule {
    static forRoot(options: ErrorReporterOptions): DynamicModule {
        return {
            module: ErrorReporterModule,
            providers: [
                ErrorMessageFormatterHelper,
                {
                    inject: [ErrorMessageFormatterHelper],
                    provide: SLACK_CLIENT,
                    useFactory: (
                        errorMessageFormatterHelper: ErrorMessageFormatterHelper,
                    ) => {
                        return new SlackClient({
                            webhookUrl: options.webhookUrl,
                            errorMessageFormatterHelper:
                                errorMessageFormatterHelper,
                        });
                    },
                },
                {
                    provide: APP_FILTER,
                    useClass: ErrorReporterFilter,
                },
            ],
            exports: [SLACK_CLIENT],
        };
    }

    static forRootAsync(options: ErrorReporterAsyncOptions): DynamicModule {
        return {
            module: ErrorReporterModule,
            imports: options.imports || [],
            providers: [
                ...this.createAsyncProviders(options),
                {
                    provide: APP_FILTER,
                    useClass: ErrorReporterFilter,
                },
            ],
            exports: [SLACK_CLIENT],
        };
    }

    private static createAsyncProviders(
        options: ErrorReporterAsyncOptions,
    ): Provider[] {
        if (options.useFactory) {
            return [
                {
                    provide: SLACK_CLIENT,
                    useFactory: async (
                        errorMessageFormatterHelper: ErrorMessageFormatterHelper,
                        ...args: any[]
                    ) => {
                        const config = await options.useFactory!(
                            ...(args as unknown[]),
                        );
                        return new SlackClient({
                            webhookUrl: config.webhookUrl,
                            errorMessageFormatterHelper:
                                errorMessageFormatterHelper,
                        });
                    },
                    inject: [ErrorMessageFormatterHelper],
                },
            ];
        }

        throw new Error('Invalid async configuration');
    }
}
