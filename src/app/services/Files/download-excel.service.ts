import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable, Inject, InjectionToken, Optional } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { API_BASE_URL } from '../api/api-promodel';

@Injectable({
  providedIn: 'root'
})
export class DownloadExcelService {
  private apiBaseUrl: string;
  httpClient: any;

  constructor(
    private http: HttpClient,
    @Optional() @Inject(API_BASE_URL) baseUrl?: string
  ) {
    this.apiBaseUrl = baseUrl?? '';
  }

  descargarArchivoExcel(castingId: string) {
    const url = `${this.apiBaseUrl}/api/Casting/${castingId}/excel`;
    return this.http.get(url, { responseType: 'blob' });
  }

  descargarArchivoExcel2(castingId: string, formato: string): Observable<HttpResponse<Blob>> {
    const url = `${this.apiBaseUrl}/api/Casting/${castingId}/excel?formato=${formato}`;
    return this.http.get(url, {
      responseType: 'blob',
      observe: 'response',
    });
  }

  descargarArchivoLista(listaId: string, formato: string): Observable<HttpResponse<Blob>> {
    const url = `${this.apiBaseUrl}/api/Casting/${listaId}/excel/lista?formato=${formato}`;
    return this.http.get(url, {
      responseType: 'blob',
      observe: 'response',
    });
  }
}
