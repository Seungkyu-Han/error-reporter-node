import { ErrorMessageFormatterHelper } from './helper/error-message-formatter.helper';
import { DiscordClient } from './discord-client';

describe('DiscordClient', () => {
    const webhookUrl = 'https://test-webhook';

    let errorMessageFormatterHelper: ErrorMessageFormatterHelper;
    let discordClient: DiscordClient;

    beforeEach(() => {
        errorMessageFormatterHelper = new ErrorMessageFormatterHelper();
        jest.spyOn(errorMessageFormatterHelper, 'errorMessage').mockReturnValue(
            'formatted message',
        );

        discordClient = new DiscordClient({
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
            new DiscordClient({
                webhookUrl,
                errorMessageFormatterHelper,
            });
        });
    });

    describe('report', () => {
        it('should call fetch with correct arguments', async () => {
            const option = {};

            await discordClient.report(option);

            expect(global.fetch).toHaveBeenCalledWith(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: 'formatted message' }),
            });
        });

        it('should not throw even if fetch fails', async () => {
            (global.fetch as jest.Mock).mockRejectedValue(
                new Error('network error'),
            );

            const option = {};

            await expect(discordClient.report(option)).resolves.not.toThrow();
        });
    });
});
