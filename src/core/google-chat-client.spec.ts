import { ErrorMessageFormatterHelper } from './helper/error-message-formatter.helper';
import { GoogleChatClient } from './google-chat-client';

describe('GoogleChatClient', () => {
    const webhookUrl = 'https://test-webhook';

    let errorMessageFormatterHelper: ErrorMessageFormatterHelper;
    let googleChatClient: GoogleChatClient;

    beforeEach(() => {
        errorMessageFormatterHelper = new ErrorMessageFormatterHelper();
        jest.spyOn(errorMessageFormatterHelper, 'errorMessage').mockReturnValue(
            'formatted message',
        );

        googleChatClient = new GoogleChatClient({
            webhookUrl,
            errorMessageFormatterHelper,
        });

        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('constructor', () => {
        it('input all properties', () => {
            new GoogleChatClient({
                webhookUrl,
                errorMessageFormatterHelper,
            });
        });
    });

    describe('report', () => {
        it('should call fetch with correct arguments', async () => {
            const option = {};

            await googleChatClient.report(option);

            expect(global.fetch).toHaveBeenCalledWith(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: 'formatted message' }),
            });
        });

        it('should not throw even if fetch fails', async () => {
            (global.fetch as jest.Mock).mockRejectedValue(
                new Error('network error'),
            );

            const option = {};

            await expect(
                googleChatClient.report(option),
            ).resolves.not.toThrow();
        });
    });
});
