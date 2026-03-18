import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  private apiUrl = 'http://localhost:5000/api/workflows';

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return new HttpHeaders({
      'Authorization': `Bearer ${user.token}`
    });
  }

  getWorkflows(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  createWorkflow(workflow: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, workflow, { headers: this.getHeaders() });
  }

  executeWorkflow(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/execute`, {}, { headers: this.getHeaders() });
  }
}
