import { Endpoint, AuthType } from './endpoint';
import Nexmo from '.';

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
  constructor(client: Nexmo) {
    super(client);
  }

  baseUrlType(): string {
    return 'rest';
  }

  authType(): AuthType {
    return AuthType.Query;
  }

  async send(params: SmsRequest, callback?: CallableFunction) {
    const data = await this.post<SmsResponse>('/sms/json', params);

    // Extract any failing messages
    const failing = data.messages.filter((m) => m.status !== '0');
    if (failing.length > 0) {
      return this.error(data.messages[0], callback);
    }

    return this.respond(data, callback);
  }
}

export { Sms, SmsRequest, SmsResponse, SmsSuccessResponse, SmsErrorResponse };
