# Error Reporter for NestJS

[![NPM version](https://img.shields.io/npm/v/@seungkyu/error-reporter.svg?label=npm%20(stable))](https://npmjs.org/package/@seungkyu/error-reporter)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@seungkyu/error-reporter)
![npm downloads](https://img.shields.io/npm/dm/@seungkyu/error-reporter)
![license](https://img.shields.io/npm/l/@seungkyu/error-reporter)

A TypeScript library for NestJS that sends error reports to messaging platforms like Slack.

## Installation

```shell
npm install @seungkyu/error-reporter
```

## Usage

### Synchronous configuration

```ts
@Module({
    imports: [
        ErrorReporterModule.forRoot({
            serverName: process.env.SERVER_NAME,
            webhookUrl: process.env.WEBHOOK_URL || '',
        }),
    ],
})
export class ReporterModule {}
```

### Asynchronous configuration
```ts
@Module({
    imports: [
        ErrorReporterModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                webhookUrl: configService.getOrThrow('ERROR_WEBHOOK_URL'),
                serverName: 'server name',
            }),
        }),
    ],
})
export class ReporterModule {}

```
When an error other than an HttpException occurs on the server, it is reported according to the configured settings.

## Configuration

| Option     | Type   | Required | Default        | Description                          |
|------------|--------|----------|----------------|--------------------------------------|
| webhookUrl | string | ✅        | -              | Slack webhook URL to send error logs |
| serverName | string | ❌        | unknown server | Identifier for the server            |

## Example
![img.png](https://raw.githubusercontent.com/Seungkyu-Han/error-reporter-node/refs/heads/develop/example.png)

## Contact

- Email: [trust1204@gmail.com](mailto:trust1204@gmail.com)