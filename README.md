# Error Reporter for NestJS

[![NPM version](https://img.shields.io/npm/v/@seungkyu/error-reporter.svg?label=npm%20(stable))](https://npmjs.org/package/@seungkyu/error-reporter)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@seungkyu/error-reporter)
![npm downloads](https://img.shields.io/npm/dm/@seungkyu/error-reporter)
![license](https://img.shields.io/npm/l/@seungkyu/error-reporter)

A TypeScript library for NestJS that sends error reports to messaging platforms like Slack.

When an error other than an HttpException occurs on the server, it is reported according to the configured settings.

## Installation

```shell
npm install @seungkyu/error-reporter
```

## Usage

#### Synchronous configuration

```ts

@Module({
    imports: [
        ErrorReporterModule.forRoot({
            type: 'slack',
            webhookUrl: process.env.WEBHOOK_URL || '',
            serverName: process.env.SERVER_NAME,
        }),
    ],
})
export class AppModule {
}
```

#### Asynchronous configuration

```ts

@Module({
    imports: [
        ErrorReporterModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'slack',
                webhookUrl: configService.getOrThrow('WEBHOOK_URL'),
                serverName: configService.getOrThrow('SERVER_NAME'),
            }),
        }),
    ],
})
export class ReporterModule {
}

```

#### Configuration

##### slack, discord, google-chat

| Option     | Type                              | Required | Default        | Description                          |
|------------|-----------------------------------|----------|----------------|--------------------------------------|
| type       | 'slack', 'discord', 'google-chat' | ✅        | -              | type of messenger                    |
| webhookUrl | string                            | ✅        | -              | Slack webhook URL to send error logs |
| serverName | string                            | ❌        | unknown server | Identifier for the server            |

##### github
| Option     | Type     | Required | Default        | Description                                  |
|------------|----------|----------|----------------|----------------------------------------------|
| type       | 'github' | ✅        | -              | type of messenger                            |
| webhookUrl | string   | ✅        | -              | Slack webhook URL to send error logs         |
| owner      | string   | ✅        | -              | Repository owner (user or organization)      |
| repository | string   | ✅        | -              | Repository name where issues will be created |
| serverName | string   | ❌        | unknown server | Identifier for the server                    |

❗Warning

If an invalid or unauthorized token is provided, the application will fail to start.

The server will also fail to start if any of the required GitHub configuration values are missing or incorrect, including:

## Example

### slack

![slack-example.png](https://raw.githubusercontent.com/Seungkyu-Han/Seungkyu-Han/refs/heads/main/slack_example.png)

### discord

![discord-example.png](https://raw.githubusercontent.com/Seungkyu-Han/Seungkyu-Han/refs/heads/main/discord_example.png)

### google-chat

![google-chat-example.png](https://raw.githubusercontent.com/Seungkyu-Han/Seungkyu-Han/refs/heads/main/google_example.png)

### github

![github-example.png](https://raw.githubusercontent.com/Seungkyu-Han/Seungkyu-Han/refs/heads/main/github_issue_example.png)

## Contact

- Email: [trust1204@gmail.com](mailto:trust1204@gmail.com)