import { Endpoint, AuthType } from './endpoint';

type VoiceRequest = {
  to: PhoneEndpoint[];
  from: PhoneEndpoint;
  ncco: object[];
};

type PhoneEndpoint = {
  type: string;
  number: string;
};

type VoiceResponse = {
  uuid: string;
  status: string;
  direction: string;
  conversation_uuid: string;
};

class Voice extends Endpoint {
  authType(): AuthType {
    return AuthType.JWT;
  }

  async call(params: VoiceRequest): Promise<VoiceResponse> {
    return this.post<VoiceResponse>('/v1/calls', params);
  }

  handleError(response) {
    const title = response.data.error_title || response.data.title;
    let body = `${response.data.type}: ${title}`;
    if (response.data.invalid_parameters) {
      body += '\n\n' + JSON.stringify(response.data.invalid_parameters);
    }
    return new Error(body);
  }
}

export { Voice, VoiceRequest, PhoneEndpoint, VoiceResponse };
