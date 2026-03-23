import { Injectable } from '@nestjs/common';
import { CoreClient } from './core-client';
import { ErrorMessageFormatterHelper } from './helper/error-message-formatter.helper';
import { MessageBuilderOption } from '../types/message-builder.option';

@Injectable()
export class DiscordClient extends CoreClient {
    private readonly webhookUrl: string;
    private readonly errorMessageFormatterHelper: ErrorMessageFormatterHelper;

    constructor({
        webhookUrl,
        errorMessageFormatterHelper,
    }: {
        webhookUrl: string;
        errorMessageFormatterHelper: ErrorMessageFormatterHelper;
    }) {
        super();
        this.webhookUrl = webhookUrl;
        this.errorMessageFormatterHelper = errorMessageFormatterHelper;
    }

    async report(messageBuilderOption: MessageBuilderOption) {
        const sendMessage: string =
            this.errorMessageFormatterHelper.errorMessage(messageBuilderOption);
        try {
            await fetch(this.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: sendMessage }),
            });
        } catch (error) {
            console.error('error reporter fail to send:', error);
        }
    }
}
