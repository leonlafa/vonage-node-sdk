import { Endpoint, AuthType } from './endpoint';

type SmsRequest = {
  to: string;
  from: string;
  text: string;
  unicode?: boolean;
};

type SmsResponse = {
  'message-count': number;
  messages: (SmsErrorResponse | SmsSuccessResponse)[];
};

type SmsSuccessResponse = {
  status: string;
  to: string;
  'message-id': string;
  'remaining-balance': string;
  'message-price': string;
  network: string;
};

type SmsErrorResponse = {
  status: string;
  'error-text': string;
};

class Sms extends Endpoint {
  baseUrlType(): string {
    return 'rest';
  }

  defaultHeaders(): object {
    return {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
  }

  authType(): AuthType {
    return AuthType.Query;
  }

  async send(params: SmsRequest): Promise<SmsResponse> {
    const data = await this.post<SmsResponse>('/sms/json', params);

    // Extract any failing messages
    const failing = data.messages.filter((m) => m.status !== '0');
    if (failing.length > 0) {
      return Promise.reject(data.messages[0]);
    }

    return data;
  }
}

export { Sms, SmsRequest, SmsResponse, SmsSuccessResponse, SmsErrorResponse };
