import { SlackClient } from './slack-client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleChatClient extends SlackClient {}
