import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-testing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.css']
})
export class TestingComponent implements OnInit {
  testRequest = {
    method: 'GET',
    url: '',
    serviceId: ''
  };
  headersJson = '{}';
  bodyJson = '{}';
  activeTab = 'headers';
  response: any = null;
  loading = false;

  constructor(private apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Check if we came from a specific service
    this.route.queryParams.subscribe(params => {
      if (params['serviceId']) {
        this.loadServiceDetails(params['serviceId']);
      }
    });
  }

  loadServiceDetails(id: string): void {
    this.apiService.getServices().subscribe(services => {
      const service = services.find(s => s._id === id);
      if (service) {
        this.testRequest.url = service.endpoint;
        this.testRequest.method = service.method;
        this.testRequest.serviceId = id;
        this.headersJson = JSON.stringify(service.headers || {}, null, 2);
        this.bodyJson = JSON.stringify(service.body || {}, null, 2);
      }
    });
  }

  sendRequest(): void {
    this.loading = true;
    this.response = null;

    let headers = {};
    let body = {};

    try {
      headers = JSON.parse(this.headersJson);
      if (this.testRequest.method !== 'GET') {
        body = JSON.parse(this.bodyJson);
      }
    } catch (e) {
      alert('Invalid JSON in Headers or Body');
      this.loading = false;
      return;
    }

    const payload = {
      ...this.testRequest,
      headers,
      body
    };

    this.apiService.testAPI(payload).subscribe({
      next: (res) => {
        this.response = res;
        this.loading = false;
      },
      error: (err) => {
        this.response = err.error || { status: 500, data: err.message, time: 0 };
        this.loading = false;
      }
    });
  }
}
