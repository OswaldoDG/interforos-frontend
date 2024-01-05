import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DownloadExcelService {
  private apiBaseUrl = 'https://localhost:7001/api/Casting';
  httpClient: any;

  constructor(private http: HttpClient) { }

  descargarArchivoExcel(castingId: string){
    const url = `${this.apiBaseUrl}/${castingId}/excel`;
    console.log(url);
    return this.http.get(url,{responseType: 'blob'});
  }

  descargarArchivoExcel2(castingId: string): Observable<HttpResponse<Blob>> {
    const url = `${this.apiBaseUrl}/${castingId}/excel`;
    return this.http.get(url, {
      responseType: 'blob',
      observe: 'response'
    });
  }



}
