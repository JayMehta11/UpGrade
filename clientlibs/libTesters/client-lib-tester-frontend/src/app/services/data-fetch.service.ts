import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataFetchService {
  private TSBackendUrl = 'http://localhost:3000';
  private JavaBackendUrl = '';

  constructor(public http: HttpClient) {}

  getVersionFromAPIHost(url: string): Observable<string> {
    return this.http.get<string>(url + '/api/version');
  }

  getAppInterfaceModelsFromTSBackend() {
    return this.http.get(this.TSBackendUrl + '/api/mock-app-models');
  }
}
