import { ErrorMessageFormatterHelper } from './error-message-formatter.helper';

describe('ErrorMessageFormatterHelper', () => {
    describe('constructor', () => {
        it('server name is not empty', () => {
            const errorMessageFormatterHelper = new ErrorMessageFormatterHelper(
                'test',
            );

            const result = errorMessageFormatterHelper.errorMessage({
                method: 'GET',
                path: '/test',
                ip: '127.0.0.1',
                body: { test: 'test' },
                error: 'test error',
                stack: 'test stack',
            });

            expect(result).toContain('test');
        });

        it('server name is empty', () => {
            const errorMessageFormatterHelper =
                new ErrorMessageFormatterHelper();

            const result = errorMessageFormatterHelper.errorMessage({
                method: 'GET',
                path: '/test',
                ip: '127.0.0.1',
                body: { test: 'test' },
                error: 'test error',
                stack: 'test stack',
            });

            expect(result).not.toContain('unknow server');
        });
    });

    describe('errorMessage', () => {
        const errorMessageFormatterHelper = new ErrorMessageFormatterHelper(
            'test',
        );

        it('should format fill message correctly', () => {
            const method = 'GET';
            const path = '/test';
            const ip = '127.0.0.1';
            const body = { test: 'test' };
            const bodyToString = JSON.stringify(body, null, 2);
            const error = 'test error';
            const stack = 'test stack';

            const result = errorMessageFormatterHelper.errorMessage({
                method,
                path,
                ip,
                body,
                error,
                stack,
            });

            expect(result).toContain(method);
            expect(result).toContain(path);
            expect(result).toContain(ip);
            expect(result).toContain(bodyToString);
            expect(result).toContain(error);
            expect(result).toContain(stack);
        });

        it('fail to parse body', () => {
            const method = 'GET';
            const path = '/test';
            const ip = '127.0.0.1';
            type Circular = {
                self?: Circular;
            };

            const body: Circular = {};
            body.self = body;
            const error = 'test error';
            const stack = 'test stack';

            const result = errorMessageFormatterHelper.errorMessage({
                method,
                path,
                ip,
                body,
                error,
                stack,
            });

            expect(result).toContain('None (Serialization Failed)');
        });

        it('should handle null body', () => {
            const result = errorMessageFormatterHelper.errorMessage({
                method: 'GET',
                path: '/test',
                ip: '127.0.0.1',
                body: null,
                error: 'error',
                stack: 'stack',
            });

            expect(result).toContain('None');
        });

        it('should handle missing stack', () => {
            const result = errorMessageFormatterHelper.errorMessage({
                method: 'GET',
                path: '/test',
                ip: '127.0.0.1',
                body: {},
                error: 'error',
                stack: undefined,
            });

            expect(result).toContain('No stack trace available');
        });

        it('should fallback to N/A for request info', () => {
            const result = errorMessageFormatterHelper.errorMessage({
                method: undefined,
                path: undefined,
                ip: undefined,
                body: {},
                error: 'error',
                stack: 'stack',
            });

            expect(result).toContain('N/A');
        });

        it('should fallback to Unknown Error', () => {
            const result = errorMessageFormatterHelper.errorMessage({
                method: 'GET',
                path: '/test',
                ip: '127.0.0.1',
                body: {},
                error: undefined,
                stack: 'stack',
            });

            expect(result).toContain('Unknown Error');
        });
    });
});
