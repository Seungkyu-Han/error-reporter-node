import { ModuleMetadata } from '@nestjs/common';
import { ErrorReporterOptions } from './error-reporter.option';

/**
 * Options for asynchronous configuration of the Error Reporter Module.
 * This allows you to inject dependencies and use a factory function to
 * provide the configuration at runtime.
 */
export interface SlackErrorReporterAsyncOptions extends Pick<
    ModuleMetadata,
    'imports'
> {
    /**
     * A factory function to create the error reporter options.
     * It can be asynchronous and can inject other providers.
     * * @param args - Dependencies injected via the `inject` property.
     * @returns A configuration object or a promise that resolves to one.
     */
    useFactory?: (
        ...args: any[]
    ) => Promise<ErrorReporterOptions> | ErrorReporterOptions;
    inject?: any[];
}
