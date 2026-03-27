import { ErrorMessageFormatterHelper } from './helper/error-message-formatter.helper';
import { GithubClient } from './github-client';

function gitHubApiUrl(owner: string, repository: string) {
    return `https://api.github.com/repos/${owner}/${repository}/issues`;
}

describe('GithubClient', () => {
    const githubToken = 'test-token';
    const repository = 'test-repo';
    const owner = 'test-owner';
    let errorMessageFormatterHelper: ErrorMessageFormatterHelper;

    let githubClient: GithubClient;

    beforeEach(() => {
        errorMessageFormatterHelper = new ErrorMessageFormatterHelper();

        jest.spyOn(errorMessageFormatterHelper, 'errorMessage').mockReturnValue(
            'formatted message',
        );

        githubClient = new GithubClient({
            githubToken,
            repository,
            owner,
            errorMessageFormatterHelper,
        });

        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('constructor', () => {
        it('input all properties', async () => {
            //before
            (global.fetch as jest.Mock).mockReturnValue({
                ok: true,
            });

            new GithubClient({
                githubToken,
                repository,
                owner,
                errorMessageFormatterHelper,
            });

            //when
            await githubClient.onModuleInit();

            //then
            const githubApiUrl = gitHubApiUrl(owner, repository);

            expect(global.fetch).toHaveBeenCalledWith(githubApiUrl, {
                method: 'GET',
                headers: {
                    Accept: 'application/vnd.github+json',
                    Authorization: `Bearer ${githubToken}`,
                    'X-GitHub-Api-Version': '2026-03-10',
                },
            });
        });

        it('github return 404 response', async () => {
            //before
            (global.fetch as jest.Mock).mockReturnValue({
                ok: false,
                status: 404,
            });

            //when
            new GithubClient({
                githubToken,
                repository,
                owner,
                errorMessageFormatterHelper,
            });

            //then
            await expect(githubClient.onModuleInit()).rejects.toThrow();
        });

        it('github return 403 response', async () => {
            //before
            (global.fetch as jest.Mock).mockReturnValue({
                ok: false,
                status: 403,
            });

            //when
            new GithubClient({
                githubToken,
                repository,
                owner,
                errorMessageFormatterHelper,
            });

            //then
            await expect(githubClient.onModuleInit()).rejects.toThrow();
        });
    });

    describe('report', () => {
        const messageBuilderOption = {
            error: 'test error',
        };

        it('should call fetch with correct arguments', async () => {
            //given
            (global.fetch as jest.Mock).mockReturnValue({
                ok: true,
            });

            //when
            await githubClient.report(messageBuilderOption);

            //then
            const githubApiUrl = gitHubApiUrl(owner, repository);

            expect(global.fetch).toHaveBeenCalledWith(githubApiUrl, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${githubToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: '[FIX] test error',
                    body: 'formatted message',
                    labels: ['bug'],
                }),
            });
        });

        it('github issue return 403 response', async () => {
            //given
            (global.fetch as jest.Mock).mockReturnValue({
                ok: false,
                status: 403,
                text: () => Promise.resolve('error message'),
            });

            //then
            await githubClient.report(messageBuilderOption);
        });

        it('github issue return 404 response', async () => {
            //given
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: false,
                status: 404,
                text: () => Promise.resolve('error message'),
            });

            //then
            await githubClient.report(messageBuilderOption);
        });

        it('github issue return 500 response', async () => {
            //given
            (global.fetch as jest.Mock).mockReturnValue({
                ok: false,
                status: 500,
                text: () => Promise.resolve('error message'),
            });

            //then
            await githubClient.report(messageBuilderOption);
        });

        it('exception when request github issue api', async () => {
            //given
            (global.fetch as jest.Mock).mockRejectedValue(new Error('error'));

            //then
            await expect(
                githubClient.report(messageBuilderOption),
            ).rejects.toThrow();
        });

        it('exception when request github issue api and not error', async () => {
            //given
            (global.fetch as jest.Mock).mockRejectedValue('test');

            //then
            await githubClient.report(messageBuilderOption);
        });
    });
});
