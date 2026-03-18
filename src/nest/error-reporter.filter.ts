import {ArgumentsHost, Catch, HttpException, Inject} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
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

            stack = exception.stack;

            await this.slackClient.report(`Error occurred\n${stack}`);
        }

        super.catch(exception, host);
    }
}