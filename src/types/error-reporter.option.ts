/**
 * Unified options for the Error Reporter Module.
 * This type will be expanded as more platforms (Discord, Google Chat, etc.) are supported.
 */
export type ErrorReporterOptions =
    | SlackErrorReporterOptions
    | DiscordErrorReporterOptions
    | GoogleChatErrorReporterOptions
    | GithubErrorReporterOptions;

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

/**
 * Configuration options for sending error reports to Discord.
 */
export type DiscordErrorReporterOptions = {
    /**
     * The type of the reporting platform.
     */
    type: 'discord';

    /**
     * The Incoming Webhook URL generated from your Discord channel.
     * @example 'https://discord.com/api/webhooks/124125125~'
     * @see https://discord.com/api/webhooks
     */
    webhookUrl: string;

    /**
     * The name of the server where the error occurred.
     * This will be displayed as `[SERVER_NAME]` at the top of the Discord message.
     * @default 'unknown server'
     * @example 'production-api'
     */
    serverName?: string;
};

/**
 * Configuration options for sending error reports to Google Chat.
 */
export type GoogleChatErrorReporterOptions = {
    /**
     * The type of the reporting platform.
     */
    type: 'google-chat';

    /**
     * The Incoming Webhook URL generated from your GoogleChat App.
     * @example 'https://chat.googleapis.com/v1/spaces/**'
     * @see https://chat.googleapis.com/v1/spaces/**
     */
    webhookUrl: string;

    /**
     * The name of the server where the error occurred.
     * This will be displayed as `[SERVER_NAME]` at the top of the Google Chat message.
     * @default 'unknown server'
     * @example 'production-api'
     */
    serverName?: string;
};

/**
 * Configuration options for sending error reports to the GitHub issue
 */
export type GithubErrorReporterOptions = {
    /**
     * The type of the reporting platform.
     */
    type: 'github';

    /**
     * A string representing the GitHub personal access token.
     * This token is used to authenticate API requests to GitHub.
     * Ensure the token is kept confidential and secure, as it provides access to your GitHub account or repository data.
     */
    githubToken: string;

    /**
     * The owner of the repository.
     * This can be a GitHub username or an organization name.
     *
     * @example "Seungkyu-Han"
     */
    owner: string;

    /**
     * The name of the repository where issues will be created.
     *
     * @example "error-reporter-node"
     */
    repository: string;

    /**
     * The name of the server where the error occurred.
     * This will be displayed as `[SERVER_NAME]` at the top of the GitHub issue.
     * @default 'unknown server'
     * @example 'production-api'
     */
    serverName?: string;
};
