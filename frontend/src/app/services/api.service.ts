import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:5000/api/services';

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return new HttpHeaders({
      'Authorization': `Bearer ${user.token}`
    });
  }

  getServices(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  addService(service: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, service, { headers: this.getHeaders() });
  }

  deleteService(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  testAPI(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/test`, data, { headers: this.getHeaders() });
  }
}
