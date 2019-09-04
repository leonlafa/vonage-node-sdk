import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import ResourceTestHelper from "./ResourceTestHelper";

import Events from "../lib/Events";
import HttpClient from "../lib/HttpClient";
import Credentials from "../lib/Credentials";

var creds = Credentials.parse({
  applicationId: "some-id",
  privateKey: __dirname + "/private-test.key"
});
var emptyCallback = () => {};

describe("Events", () => {
  var httpClientStub = null;
  var events = null;

  beforeEach(() => {
    httpClientStub = sinon.createStubInstance(HttpClient);
    var options = {
      httpClient: httpClientStub
    };
    events = new Events(creds, options);
  });

  it("should allow an event to be added to a conversation", () => {
    const conversationId = "CON-eeefffggg-444555666";
    var event = {
      type: "custom:test",
      body: {
        id: "fish",
        thing: "monkey"
      }
    };
    events.add(conversationId, event, emptyCallback);

    var expectedRequestArgs = ResourceTestHelper.requestArgsMatch(event, {
      path: `${Events.PATH.replace("{conversation_uuid}", conversationId)}`
    });
    expect(httpClientStub.request).to.have.been.calledWith(
      sinon.match(expectedRequestArgs),
      emptyCallback
    );
  });

  it("should get a collection of Events when no eventId is provided", () => {
    const conversationId = "CON-eeefffggg-444555666";
    events.get(conversationId, emptyCallback);

    var expectedRequestArgs = ResourceTestHelper.requestArgsMatch(null, {
      method: "GET",
      body: undefined,
      path: `${Events.PATH.replace("{conversation_uuid}", conversationId)}`
    });

    expect(httpClientStub.request).to.have.been.calledWith(
      sinon.match(expectedRequestArgs),
      emptyCallback
    );
  });

  it("should get a single event when an eventId is provided", () => {
    const conversationId = "CON-eeefffggg-444555666";
    const eventId = "EV-4353-34534-3453-3453";
    events.get(conversationId, eventId, emptyCallback);

    var expectedRequestArgs = ResourceTestHelper.requestArgsMatch(null, {
      method: "GET",
      body: undefined,
      path: `${Events.PATH.replace(
        "{conversation_uuid}",
        conversationId
      )}/${eventId}`
    });

    expect(httpClientStub.request).to.have.been.calledWith(
      sinon.match(expectedRequestArgs),
      emptyCallback
    );
  });
});
