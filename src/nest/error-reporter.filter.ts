import {ArgumentsHost, Catch, HttpException, Inject} from "@nestjs/common";
import {BaseExceptionFilter} from "@nestjs/core";
import {SlackClient} from "../core/slack-client";
import {SLACK_CLIENT} from "./error-reporter.token";

@Catch()
export class ErrorReporterFilter extends BaseExceptionFilter {

    constructor(
        @Inject(SLACK_CLIENT)
        private readonly slackClient: SlackClient,
    ) {
        super();
    }

    async catch(exception: unknown, host: ArgumentsHost) {
        let stack: string | undefined;

        if (!(exception instanceof HttpException) && (exception instanceof Error)) {

            const ctx = host.switchToHttp();
            const request = ctx.getRequest();

            const method = request.method;
            const path = request.url;
            const ip = request.ip || request.headers['x-forwarded-for'];

            stack = exception.stack;

            await this.slackClient.report({
                method,
                path,
                ip,
                error: exception.message,
                stack,
            });
        }

        super.catch(exception, host);
    }
}