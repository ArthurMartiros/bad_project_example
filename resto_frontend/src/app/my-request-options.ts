import {Headers, Http, BaseRequestOptions, RequestOptionsArgs, RequestOptions} from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
 export class MyRequestOptions extends BaseRequestOptions {
  constructor () {
    super();
    this.headers = new Headers({'token': localStorage.getItem('id_token')});
    this.headers.append('token', localStorage.getItem('id_token'));
  }
  merge(options?: RequestOptionsArgs): RequestOptions {
    const newOptions = super.merge(options);
    newOptions.headers.append('X-Requested-At', new Date().toISOString());
    return newOptions;
  }
}
