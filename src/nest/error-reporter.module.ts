import { DynamicModule, Module, Provider } from '@nestjs/common';
import { SlackClient } from '../core/slack-client';
import { ErrorReporterFilter } from './error-reporter.filter';
import { APP_FILTER } from '@nestjs/core';
import { SlackErrorReporterAsyncOptions } from '../types/error-reporter.async.option';
import { ErrorMessageFormatterHelper } from '../core/helper/error-message-formatter.helper';
import { CoreClient } from '../core/core-client';
import { ErrorReporterOptions } from '../types/error-reporter.option';
import { ERROR_REPORTER_OPTIONS } from './error-reporter.tokens';

/**
 * Module for reporting unhandled exceptions to various messenger platforms (Slack, etc.).
 * It automatically catches exceptions using a global filter and sends formatted alerts.
 */
@Module({})
export class ErrorReporterModule {
    private static createMessengerClient(
        options: ErrorReporterOptions,
        errorMessageFormatterHelper: ErrorMessageFormatterHelper,
    ): SlackClient {
        switch (options.type) {
            case 'slack':
                return new SlackClient({
                    webhookUrl: options.webhookUrl,
                    errorMessageFormatterHelper: errorMessageFormatterHelper,
                });
            default:
                throw new Error('Invalid messenger type');
        }
    }

    /**
     * Configures the Error Reporter Module synchronously.
     * Use this when you have the configuration values ready at the time of module definition.
     * * @param options Configuration options including type, webhookUrl, and serverName.
     * @returns A dynamic module for NestJS to import.
     * @example
     * ErrorReporterModule.forRoot({
     * type: 'slack',
     * webhookUrl: 'https://hooks.slack.com/...',
     * serverName: 'my-api-server'
     * })
     */
    static forRoot(options: ErrorReporterOptions): DynamicModule {
        return {
            module: ErrorReporterModule,
            providers: [
                {
                    provide: ErrorMessageFormatterHelper,
                    useFactory: () =>
                        new ErrorMessageFormatterHelper(options.serverName),
                },
                {
                    provide: CoreClient,
                    inject: [ErrorMessageFormatterHelper],
                    useFactory: (
                        errorMessageFormatterHelper: ErrorMessageFormatterHelper,
                    ) =>
                        this.createMessengerClient(
                            options,
                            errorMessageFormatterHelper,
                        ),
                },
                {
                    provide: APP_FILTER,
                    useClass: ErrorReporterFilter,
                },
            ],
            exports: [CoreClient],
        };
    }

    /**
     * Configures the Error Reporter Module asynchronously.
     * Use this when your configuration depends on other providers (e.g., ConfigService).
     * * @param options Async configuration options including imports, inject, and useFactory.
     * @returns A dynamic module for NestJS to import.
     * @example
     * ErrorReporterModule.forRootAsync({
     * imports: [ConfigModule],
     * inject: [ConfigService],
     * useFactory: (config: ConfigService) => ({
     * type: 'slack',
     * webhookUrl: config.get('SLACK_WEBHOOK_URL'),
     * }),
     * })
     */
    static forRootAsync(
        options: SlackErrorReporterAsyncOptions,
    ): DynamicModule {
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
            exports: [CoreClient],
        };
    }

    private static createAsyncProviders(
        options: SlackErrorReporterAsyncOptions,
    ): Provider[] {
        if (!options.useFactory) {
            throw new Error('Invalid async configuration');
        }

        const optionsProvider: Provider = {
            provide: ERROR_REPORTER_OPTIONS,
            useFactory: options.useFactory,
            inject: options.inject || [],
        };

        const helperProvider: Provider = {
            provide: ErrorMessageFormatterHelper,
            inject: [ERROR_REPORTER_OPTIONS],
            useFactory: (config: ErrorReporterOptions) =>
                new ErrorMessageFormatterHelper(config.serverName),
        };

        const clientProvider: Provider = {
            provide: CoreClient,
            inject: [ERROR_REPORTER_OPTIONS, ErrorMessageFormatterHelper],
            useFactory: (
                config: ErrorReporterOptions,
                helper: ErrorMessageFormatterHelper,
            ) => this.createMessengerClient(config, helper),
        };

        return [optionsProvider, helperProvider, clientProvider];
    }
}
