import { Injectable } from '@nestjs/common';
import { MessageBuilderOption } from '../../types/message-builder.option';

@Injectable()
export class ErrorMessageFormatterHelper {
    private readonly serverName: string;

    constructor({ serverName }: { serverName?: string }) {
        this.serverName = serverName ?? 'unknown server';
    }

    errorMessage(messageBuilderOption: MessageBuilderOption): string {
        return `
        🚨 Unhandled Exception
        server: ${this.serverName}
        
        method: ${messageBuilderOption.method || ''}
        path: ${messageBuilderOption.path || ''}
        request ip: ${messageBuilderOption.ip || ''}
        
        error: ${messageBuilderOption.error || ''}
        
        stack:
        ${messageBuilderOption.stack || ''}
        `;
    }
}
