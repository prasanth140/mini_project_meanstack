import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private apiUrl = 'http://localhost:5000/api/logs';
  private socket: any;

  constructor(private http: HttpClient) {
    this.socket = io('http://localhost:5000');
  }

  private getHeaders() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return new HttpHeaders({
      'Authorization': `Bearer ${user.token}`
    });
  }

  getLogs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`, { headers: this.getHeaders() });
  }

  exportLogs(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export`, {
      headers: this.getHeaders(),
      responseType: 'blob'
    });
  }

  onNewLog(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('new_api_log', (data: any) => {
        observer.next(data);
      });
    });
  }
}
