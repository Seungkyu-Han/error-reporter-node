import { ArgumentsHost, Catch, HttpException, Inject } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { SlackClient } from '../core/slack-client';
import { SLACK_CLIENT } from './error-reporter.token';
import { Request } from 'express';

@Catch()
export class ErrorReporterFilter extends BaseExceptionFilter {
    constructor(
        @Inject(SLACK_CLIENT)
        private readonly slackClient: SlackClient,
    ) {
        super();
    }

    catch(exception: unknown, host: ArgumentsHost) {
        let stack: string | undefined;

        if (
            !(exception instanceof HttpException) &&
            exception instanceof Error
        ) {
            const ctx = host.switchToHttp();
            const request = ctx.getRequest<Request>();

            const method = request.method;
            const path = request.url;
            const ip = request.ip ?? 'unknown ip';
            const body = request.body as unknown;

            stack = exception.stack;

            this.slackClient
                .report({
                    method,
                    path,
                    ip,
                    body,
                    error: exception.message,
                    stack,
                })
                .catch(() => {});
        }

        super.catch(exception, host);
    }
}
