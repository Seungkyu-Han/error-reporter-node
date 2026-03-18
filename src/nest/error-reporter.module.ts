import {DynamicModule, Module, Provider} from "@nestjs/common";
import {SlackClient} from "../core/slack-client";
import {SLACK_CLIENT} from "./error-reporter.token";
import {ErrorReporterFilter} from "./error-reporter.filter";
import {APP_FILTER} from "@nestjs/core";
import {ErrorReporterOptions} from "../types/error-reporter.option";
import {ErrorReporterAsyncOptions} from "../types/error-reporter.async.option";


@Module({})
export class ErrorReporterModule {
    static forRoot(options: ErrorReporterOptions): DynamicModule {
        return {
            module: ErrorReporterModule,
            providers: [
                {
                    provide: SLACK_CLIENT,
                    useValue: new SlackClient({
                        webhookUrl: options.webhookUrl,
                        serverName: options.serverName,
                    }),
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
                    useFactory: async (...args: any[]) => {
                        const config = await options.useFactory!(...args);
                        return new SlackClient({
                            webhookUrl: config.webhookUrl,
                            serverName: config.serverName,
                        });
                    },
                    inject: options.inject || [],
                },
            ];
        }

        throw new Error("Invalid async configuration");
    }
}