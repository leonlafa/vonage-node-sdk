import { Sms } from './sms';

type NexmoAuth = {
  apiKey: string;
  apiSecret: string;
};

type NexmoOptions = {
  rest?: string;
};

class Nexmo {
  public auth: NexmoAuth;
  public options: NexmoOptions;

  // Available API Endpoints
  public sms: Sms;

  constructor(auth: NexmoAuth, options?: NexmoOptions) {
    this.auth = auth;
    this.options = options || {};

    this.registerApis();
  }

  registerApis() {
    this.sms = new Sms(this);
  }
}

export default Nexmo;
