import { Injectable, Optional } from '@nestjs/common';
import { MessageBuilderOption } from '../../types/message-builder.option';

@Injectable()
export class ErrorMessageFormatterHelper {
    private readonly serverName: string;

    constructor(@Optional() serverName?: string) {
        this.serverName = serverName ?? 'unknown server';
    }

    errorMessage(messageBuilderOption: MessageBuilderOption): string {
        const { method, path, ip, body, error, stack } = messageBuilderOption;

        let bodyContent: string;
        try {
            bodyContent = body ? JSON.stringify(body, null, 2) : 'None';
        } catch {
            bodyContent = 'None (Serialization Failed)';
        }

        return `
🔥 *[${this.serverName.toUpperCase()}] Unhandled Exception*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

*📍 Request Information*
- *Method:* \`${method || 'N/A'}\`
- *Path:* \`${path || 'N/A'}\`
- *IP:* \`${ip || 'N/A'}\`
- *Timestamp:* \`${new Date().toISOString()}\`

*📦 Request Body*
\`\`\`json
${bodyContent}
\`\`\`

*❌ Error Message*
> \`${error || 'Unknown Error'}\`

*📜 Stack Trace*
\`\`\`text
${stack ? stack.split('\n').join('\n') + '\n...' : 'No stack trace available'}
\`\`\`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `.trim();
    }
}
