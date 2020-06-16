import axios, { AxiosInstance } from 'axios';
import Nexmo from '.';
const maybe = require('call-me-maybe');

enum AuthType {
  Query,
  JWT,
  Basic,
}

class Endpoint {
  protected readonly http: AxiosInstance;
  public readonly nexmo: Nexmo;

  constructor(client) {
    this.nexmo = client;
    this.http = axios.create({
      baseURL: this.getBaseUrl(),
    });
  }

  authType(): AuthType {
    throw new Error('AuthType() not implemented');
  }

  baseUrlType(): string {
    return 'api';
  }

  getBaseUrl(): string {
    const baseUrlType: string = this.baseUrlType();

    // If there's an overridden value, let's use that
    if (this.nexmo.options[baseUrlType]) {
      return this.nexmo.options[baseUrlType];
    }

    if (baseUrlType == 'rest') {
      return 'https://rest.nexmo.com';
    }

    return 'https://api.nexmo.com';
  }

  post<type>(url, data, headers = {}) {
    return this.request<type>('post', url, data, headers);
  }

  async request<type>(method, url, data, headers = {}) {
    ({ url, data, headers } = this.authenticateRequest(
      url,
      data,
      headers,
      method
    ));

    const r = await this.http.request<type>({
      method,
      url,
      data,
      headers,
    });

    // 404 won't throw, but everything else will
    // @TODO: Handle it here

    return r.data;
  }

  authenticateRequest(url, data, headers, method) {
    if (this.authType() == AuthType.Query && method === 'get') {
      url += `?api_key=${this.nexmo.auth.apiKey}&api_secret=${this.nexmo.auth.apiSecret}`;
    }

    if (this.authType() == AuthType.Query && method === 'post') {
      data.api_key = this.nexmo.auth.apiKey;
      data.api_secret = this.nexmo.auth.apiSecret;
    }

    return { url, data, headers, method };
  }

  error(err, callback): object {
    if (typeof callback == 'function') {
      return callback(err);
    }

    return Promise.reject(err);
  }

  respond(data, callback): object {
    if (typeof callback == 'function') {
      return callback(null, data);
    }

    return Promise.resolve(data);
  }
}

export { Endpoint, AuthType };
