import { ModuleMetadata } from '@nestjs/common';
import { ErrorReporterOptions } from './error-reporter.option';

export interface ErrorReporterAsyncOptions extends Pick<
    ModuleMetadata,
    'imports'
> {
    useFactory?: (
        ...args: any[]
    ) => Promise<ErrorReporterOptions> | ErrorReporterOptions;
    inject?: any[];
}
