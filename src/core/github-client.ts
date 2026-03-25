import { CoreClient } from './core-client';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { MessageBuilderOption } from '../types/message-builder.option';
import { ErrorMessageFormatterHelper } from './helper/error-message-formatter.helper';

@Injectable()
export class GithubClient extends CoreClient implements OnModuleInit {
    private readonly githubToken: string;
    private readonly repository: string;
    private readonly owner: string;
    private readonly errorMessageFormatterHelper: ErrorMessageFormatterHelper;

    constructor({
        githubToken,
        repository,
        owner,
        errorMessageFormatterHelper,
    }: {
        githubToken: string;
        repository: string;
        owner: string;
        errorMessageFormatterHelper: ErrorMessageFormatterHelper;
    }) {
        super();
        this.githubToken = githubToken;
        this.repository = repository;
        this.owner = owner;
        this.errorMessageFormatterHelper = errorMessageFormatterHelper;
    }

    async onModuleInit() {
        await this.checkGithubAccess();
    }

    private async checkGithubAccess(): Promise<void> {
        const response = await fetch(
            `https://api.github.com/repos/${this.owner}/${this.repository}/issues`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/vnd.github+json',
                    Authorization: `Bearer ${this.githubToken}`,
                    'X-GitHub-Api-Version': '2026-03-10',
                },
            },
        );

        if (!response.ok) {
            switch (response.status) {
                case 404:
                    throw new Error(
                        'GitHub Not Found: Invalid repository or owner',
                    );
                default:
                    throw new Error(`GitHub API Error: ${response.status}`);
            }
        }
    }

    async report(messageBuilderOption: MessageBuilderOption): Promise<void> {
        const title: string = `[FIX] ${messageBuilderOption.error}`;
        const body: string =
            this.errorMessageFormatterHelper.errorMessage(messageBuilderOption);

        try {
            const response = await fetch(
                `https://api.github.com/repos/${this.owner}/${this.repository}/issues`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${this.githubToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title, body, labels: ['bug'] }),
                },
            );

            if (!response.ok) {
                const errorBody = await response.text();

                switch (response.status) {
                    case 403:
                        console.error(
                            'ErrorReporter: Insufficient permissions or rate limit exceeded, Please check your github token',
                        );
                        break;
                    case 404:
                        console.error(
                            'ErrorReporter: Invalid repository or owner',
                        );
                        break;
                    default:
                        console.error(
                            `ErrorReporter: ${response.status}: ${errorBody}`,
                        );
                }
                return;
            }
        } catch (error) {
            if (error instanceof Error)
                console.error(`ErrorReporter: ${error}`);
        }
    }
}
