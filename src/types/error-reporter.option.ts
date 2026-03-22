/**
 * Unified options for the Error Reporter Module.
 * This type will be expanded as more platforms (Discord, Google Chat, etc.) are supported.
 */
export type ErrorReporterOptions = SlackErrorReporterOptions;

/**
 * Configuration options for sending error reports to Slack.
 */
export type SlackErrorReporterOptions = {
    /**
     * The type of the reporting platform.
     */
    type: 'slack';

    /**
     * The Incoming Webhook URL generated from your Slack App.
     * @example 'https://hooks.slack.com/services/T0000/B0000/XXXX'
     * @see https://api.slack.com/messaging/webhooks
     */
    webhookUrl: string;

    /**
     * The name of the server where the error occurred.
     * This will be displayed as `[SERVER_NAME]` at the top of the Slack message.
     * @default 'unknown server'
     * @example 'production-api'
     */
    serverName?: string;
};
