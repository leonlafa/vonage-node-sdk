import axios, { AxiosInstance } from 'axios';
import Nexmo from '.';
import * as qs from 'querystring';

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

  defaultHeaders(): object {
    return {};
  }

  post<type>(url, data, headers = {}) {
    return this.request<type>('post', url, data, headers);
  }

  async request<type>(method, url, data, headers = {}) {
    headers = Object.assign({}, this.defaultHeaders(), headers);

    ({ url, data, headers } = this.authenticateRequest(
      url,
      data,
      headers,
      method
    ));

    if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      data = qs.stringify(data);
    }

    try {
      const r = await this.http.request<type>({
        method,
        url,
        data,
        headers,
      });

      return r.data;
    } catch (e) {
      return Promise.reject(this.handleError(e.response));
    }
  }

  authenticateRequest(url, data, headers, method) {
    if (this.authType() == AuthType.Query && method === 'get') {
      url += `?api_key=${this.nexmo.auth.apiKey}&api_secret=${this.nexmo.auth.apiSecret}`;
    }

    if (this.authType() == AuthType.Query && method === 'post') {
      data.api_key = this.nexmo.auth.apiKey;
      data.api_secret = this.nexmo.auth.apiSecret;
    }

    if (this.authType() == AuthType.JWT) {
      headers.Authorization = 'Bearer ' + this.generateJwt();
    }

    return { url, data, headers, method };
  }

  generateJwt() {
    return '---';
  }

  handleError(e) {
    return new Error('Generic error :: ' + JSON.stringify(e.data));
  }
}

export { Endpoint, AuthType };
