import { MessageBuilderOption } from '../types/message-builder.option';

export abstract class CoreClient {
    abstract report(messageBuilderOption: MessageBuilderOption): Promise<void>;
}
