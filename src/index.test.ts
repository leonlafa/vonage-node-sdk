import Nexmo from './index';
import { Sms, SmsErrorResponse, SmsResponse, SmsSuccessResponse } from './sms';

test('can be instantiated', async (done) => {
  const nexmo = new Nexmo({
    apiKey: '---',
    apiSecret: '---',
  });

  const r = nexmo.sms.send(
    {
      to: '---',
      from: 'Demo',
      text: 'this is an example',
    },
    (err: SmsErrorResponse, data: SmsResponse) => {
      console.log(err);
      let x = data.messages[0] as SmsSuccessResponse;
      console.log(x.network);
      console.log(x['remaining-balance']);
      done();
    }
  );
});
