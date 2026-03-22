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

### Slack

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

| Option     | Type    | Required | Default        | Description                          |
|------------|---------|----------|----------------|--------------------------------------|
| type       | 'slack' | ✅        | -              | type to slack                        |
| webhookUrl | string  | ✅        | -              | Slack webhook URL to send error logs |
| serverName | string  | ❌        | unknown server | Identifier for the server            |

## Example

![img.png](https://private-user-images.githubusercontent.com/98071131/567419149-a28d215c-2831-49e4-a4de-86ce61da0cb3.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NzQxOTE2MDIsIm5iZiI6MTc3NDE5MTMwMiwicGF0aCI6Ii85ODA3MTEzMS81Njc0MTkxNDktYTI4ZDIxNWMtMjgzMS00OWU0LWE0ZGUtODZjZTYxZGEwY2IzLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNjAzMjIlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwMzIyVDE0NTUwMlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTA5NDQ4M2M5ZGY0MTk2ZjdkY2UzYmE3NTg0MTU3ZTAzN2YxMDFmNzNlNmI1OGUzNWFkNTEwNjk4MmU4ZWQyZDUmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.suVKa4kjvgaW-ouqtwgC6Zui3yXMH3VIMRg4O_HMwcQ)

## Contact

- Email: [trust1204@gmail.com](mailto:trust1204@gmail.com)