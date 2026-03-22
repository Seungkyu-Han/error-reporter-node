import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request } from 'express';
import { CoreClient } from '../core/core-client';

@Catch()
export class ErrorReporterFilter extends BaseExceptionFilter {
    constructor(private readonly client: CoreClient) {
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

            this.client
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
