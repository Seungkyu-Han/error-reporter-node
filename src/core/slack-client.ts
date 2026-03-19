import {MessageBuilderOption} from "../types/message-builder.option";


export class SlackClient {
    private readonly webhookUrl: string;
    private readonly serverName: string;

    constructor({
                    webhookUrl, serverName
                }: { webhookUrl: string, serverName?: string }) {
        this.webhookUrl = webhookUrl
        this.serverName = serverName ?? 'unknown server';
    }

    private buildMessage(messageBuilderOption: MessageBuilderOption) {
        return `
        🚨 Unhandled Exception
        server: ${this.serverName}
        
        method: ${messageBuilderOption.method || ""}
        path: ${messageBuilderOption.path || ""}
        request ip: ${messageBuilderOption.ip || ""}
        
        error: ${messageBuilderOption.error || ""}
        
        stack:
        ${messageBuilderOption.stack || ""}
        `;
    }

    async report(messageBuilderOption: MessageBuilderOption) {
        const sendMessage = this.buildMessage(messageBuilderOption);
        await fetch(this.webhookUrl, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: sendMessage }),
        })
    }
}