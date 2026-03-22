import { MessageBuilderOption } from '../types/message-builder.option';
import { Injectable } from '@nestjs/common';
import { ErrorMessageFormatterHelper } from './helper/error-message-formatter.helper';

@Injectable()
export class SlackClient {
    private readonly webhookUrl: string;
    private readonly errorMessageFormatterHelper: ErrorMessageFormatterHelper;

    constructor({
        webhookUrl,
        errorMessageFormatterHelper,
    }: {
        webhookUrl: string;
        errorMessageFormatterHelper: ErrorMessageFormatterHelper;
    }) {
        this.webhookUrl = webhookUrl;
        this.errorMessageFormatterHelper = errorMessageFormatterHelper;
    }

    async report(messageBuilderOption: MessageBuilderOption) {
        const sendMessage: string =
            this.errorMessageFormatterHelper.errorMessage(messageBuilderOption);
        await fetch(this.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: sendMessage }),
        });
    }
}
