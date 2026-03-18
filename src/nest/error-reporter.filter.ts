import {ArgumentsHost, Catch, ExceptionFilter, HttpException, Inject} from "@nestjs/common";
import {SlackClient} from "../core/slack-client";
import {SLACK_CLIENT} from "./error-reporter.token";

@Catch()
export class ErrorReporterFilter implements ExceptionFilter {

    constructor(
        @Inject(SLACK_CLIENT)
        private readonly slackClient: SlackClient,
    ) {}

    async catch(exception: unknown, host: ArgumentsHost) {
        let stack: string | undefined;

        if (!(exception instanceof HttpException) && (exception instanceof Error)) {

            stack = exception.stack;

            await this.slackClient.report(`Error occurred\n${stack}`);
        }

        throw exception;
    }
}