

export class SlackClient {
    private readonly webhookUrl: string;
    private readonly serverName: string;

    constructor({
                    webhookUrl, serverName
                }: { webhookUrl: string, serverName?: string }) {
        this.webhookUrl = webhookUrl
        this.serverName = serverName ?? 'unknown server';
    }

    private buildMessage(message: string, req?: any, stack?: string) {
        return `
        🚨 Unhandled Exception
        server: ${this.serverName}
        
        method: ${req?.method || ""}
        path: ${req?.url || ""}
        
        error: ${message}
        
        stack:
        ${stack}
        `;
    }

    async report(message: string) {
        const sendMessage = this.buildMessage(message);
        await fetch(this.webhookUrl, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: sendMessage }),
        })
    }
}