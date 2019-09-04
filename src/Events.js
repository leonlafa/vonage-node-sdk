import nexmo from "./index";

/**
 * Provides access to the `conversations/{conversation_uuid}/events` resource.
 */
class Events {
  /**
   * The path to the `events` resource.
   */
  static get PATH() {
    return "/beta/conversations/{conversation_uuid}/events";
  }

  /**
   * Creates a new Events object.
   *
   * @param {Credentials} creds - Credentials used when interacting with the Nexmo API.
   * @param {Object} options - additional options for the class.
   */
  constructor(creds, options) {
    this.creds = creds;
    this.options = options;

    this._nexmo = this.options.nexmoOverride || nexmo;
  }

  /**
   * Create an event on the conversation.
   *
   * @param {string} conversationId - The conversation to trigger the event on.
   * @param {object} event - the event parameters
   * @param {string} event.type - the type of event. A custom event must be prefixed with "custom:" e.g. "custom:my_event"
   * @param {string} event.from - the ID of the member of the conversation that is triggering the event
   * @param {object} event.body - the event payload
   * @param {function} callback - function to be called when the request completes.
   */
  create(conversationId, params, callback) {
    params = JSON.stringify(params);

    var config = {
      host: "api.nexmo.com",
      path: Events.PATH.replace("{conversation_uuid}", conversationId),
      method: "POST",
      body: params,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.creds.generateJwt()}`
      }
    };
    this.options.httpClient.request(config, callback);
  }

  /**
   * Get a collection of events or details of a single event.
   *
   * @param {string} [conversationId] - The unique identifier for the conversation
   * @param {string} [eventId] - The unique identifier for a single event to retrieve. Optional.
   * @param {function} callback - function to be called when the request completes.
   */
  get(conversationId, eventId, callback) {
    callback = typeof eventId === "function" ? eventId : callback;

    var config = {
      host: "api.nexmo.com",
      path:
        Events.PATH.replace("{conversation_uuid}", conversationId) +
        (typeof eventId !== "function" ? `/${eventId}` : ""),
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.creds.generateJwt()}`
      }
    };
    this.options.httpClient.request(config, callback);
  }
}

export default Events;
