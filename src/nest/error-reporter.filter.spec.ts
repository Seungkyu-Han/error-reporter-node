import { ArgumentsHost, HttpException } from '@nestjs/common';
import { ErrorReporterFilter } from './error-reporter.filter';
import { CoreClient } from '../core/core-client';
import { Request } from 'express';

describe('ErrorReporterFilter', () => {
    let filter: ErrorReporterFilter;
    let client: jest.Mocked<CoreClient>;
    let reportSpy: jest.Mock;

    const mockHost = (request: Request): ArgumentsHost =>
        ({
            switchToHttp: () => ({
                getRequest: (): Request => request,
            }),
        }) as unknown as ArgumentsHost;

    beforeEach(() => {
        reportSpy = jest.fn().mockResolvedValue(undefined);

        client = {
            report: reportSpy,
        } as unknown as jest.Mocked<CoreClient>;

        filter = new ErrorReporterFilter(client);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should call report when exception is Error', () => {
        const error = new Error('test error');

        const request = {
            method: 'GET',
            url: '/test',
            ip: '127.0.0.1',
            body: { a: 1 },
        };

        const host = mockHost(request as unknown as Request);

        const superSpy = jest
            .spyOn(
                Object.getPrototypeOf(ErrorReporterFilter.prototype),
                'catch',
            )
            .mockImplementation(() => {});

        filter.catch(error, host);

        expect(reportSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                method: 'GET',
                path: '/test',
                ip: '127.0.0.1',
                body: { a: 1 },
                error: 'test error',
            }),
        );

        expect(superSpy).toHaveBeenCalled();

        superSpy.mockRestore();
    });

    it('should call report when exception is Error and ip is empty', () => {
        const error = new Error('test error');

        const request = {
            method: 'GET',
            url: '/test',
            body: { a: 1 },
        };

        const host = mockHost(request as unknown as Request);

        const superSpy = jest
            .spyOn(
                Object.getPrototypeOf(ErrorReporterFilter.prototype),
                'catch',
            )
            .mockImplementation(() => {});

        filter.catch(error, host);

        expect(reportSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                method: 'GET',
                path: '/test',
                ip: 'unknown ip',
                body: { a: 1 },
                error: 'test error',
            }),
        );

        expect(superSpy).toHaveBeenCalled();

        superSpy.mockRestore();
    });

    it('should not call report when exception is HttpException', () => {
        const exception = new HttpException('error', 400);

        const request = {
            method: 'GET',
            url: '/test',
            ip: '127.0.0.1',
            body: {},
        };

        const host = mockHost(request as unknown as Request);

        const superSpy = jest
            .spyOn(ErrorReporterFilter.prototype as any, 'catch')
            .mockImplementation(() => {});

        filter.catch(exception, host);

        expect(reportSpy).not.toHaveBeenCalled(); // ✅ 수정
        expect(superSpy).toHaveBeenCalled();

        superSpy.mockRestore();
    });

    it('should not call report when exception is not Error', () => {
        const exception = 'string error';

        const request = {
            method: 'GET',
            url: '/test',
            ip: '127.0.0.1',
            body: {},
        };

        const host = mockHost(request as unknown as Request);

        const superSpy = jest
            .spyOn(ErrorReporterFilter.prototype as any, 'catch')
            .mockImplementation(() => {});

        filter.catch(exception, host);

        expect(reportSpy).not.toHaveBeenCalled();
        expect(superSpy).toHaveBeenCalled();

        superSpy.mockRestore();
    });

    it('should handle report failure silently', () => {
        const error = new Error('test error');

        reportSpy.mockRejectedValue(new Error('fail'));

        const request = {
            method: 'GET',
            url: '/test',
            ip: '127.0.0.1',
            body: {},
        };

        const host = mockHost(request as unknown as Request);

        const superSpy = jest
            .spyOn(
                Object.getPrototypeOf(ErrorReporterFilter.prototype),
                'catch',
            )
            .mockImplementation(() => {});

        filter.catch(error, host);

        expect(reportSpy).toHaveBeenCalled();

        superSpy.mockRestore();
    });

    it('should be not error', () => {
        const error = new Error('test');

        const host = mockHost({} as unknown as Request);

        const superSpy = jest
            .spyOn(
                Object.getPrototypeOf(ErrorReporterFilter.prototype),
                'catch',
            )
            .mockImplementation(() => {});

        filter.catch(error, host);

        superSpy.mockRestore();
    });
});
