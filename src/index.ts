import * as fs from 'fs';
import { Sms } from './sms';
import { Voice } from './voice';
import { Conversation } from './conversation';

type NexmoAuth = {
  apiKey?: string;
  apiSecret?: string;
  applicationId?: string;
  privateKey?: string;
  privateKeyString?: Buffer;
};

type NexmoOptions = {
  rest?: string;
};

class Nexmo {
  public auth: NexmoAuth;
  public options: NexmoOptions;

  // Available API Endpoints
  public sms: Sms;
  public voice: Voice;
  public conversation: Conversation;

  constructor(auth: NexmoAuth, options?: NexmoOptions) {
    this.auth = auth;

    if (this.auth.privateKey) {
      this.auth.privateKeyString = fs.readFileSync(this.auth.privateKey);
    }

    this.options = options || {};

    this.registerApis();
  }

  registerApis() {
    this.sms = new Sms(this);
    this.voice = new Voice(this);
    this.conversation = new Conversation(this);
  }
}

export default Nexmo;
