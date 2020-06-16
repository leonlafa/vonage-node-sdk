import { Endpoint, AuthType } from './endpoint';

type ConversationRequest = {
  name: string;
};

type ConversationResponse = {
  id: string;
};

class Conversation extends Endpoint {
  authType(): AuthType {
    return AuthType.JWT;
  }

  async create(params: ConversationRequest): Promise<ConversationResponse> {
    return this.post<ConversationResponse>('/beta/conversations', params);
  }
}

export { Conversation, ConversationRequest, ConversationResponse };
