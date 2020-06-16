import Nexmo from './index';
import { Sms, SmsErrorResponse, SmsResponse, SmsSuccessResponse } from './sms';
import { VoiceResponse } from './voice';
import { ConversationResponse } from './conversation';

test('can be instantiated', async () => {
  const nexmo = new Nexmo({
    apiKey: '---',
    apiSecret: '---',
    applicationId: '---',
    privateKey: './private.key',
  });

  const c: ConversationResponse = await nexmo.conversation.create({
    name: 'Test Conversation',
  });

  console.log(c);

  return;

  const s: SmsResponse = await nexmo.sms.send({
    to: '---',
    from: 'Demo',
    text: 'Testing',
  });

  const r: VoiceResponse = await nexmo.voice.call({
    to: [{ type: 'phone', number: '---' }],
    from: { type: 'phone', number: '---' },
    ncco: [
      {
        action: 'talk',
        text: 'This is an example, thanks for calling',
      },
    ],
  });
});
