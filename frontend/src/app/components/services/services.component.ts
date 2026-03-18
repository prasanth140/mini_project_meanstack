import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  services: any[] = [];
  showModal = false;
  newService = {
    name: '',
    endpoint: '',
    method: 'GET',
    environment: 'dev',
    category: 'external',
    description: ''
  };

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.fetchServices();
  }

  fetchServices(): void {
    this.apiService.getServices().subscribe({
      next: (data) => this.services = data,
      error: (err) => console.error('Error fetching services:', err)
    });
  }

  toggleModal(show: boolean): void {
    this.showModal = show;
  }

  saveService(): void {
    if (!this.newService.name || !this.newService.endpoint) return;

    this.apiService.addService(this.newService).subscribe({
      next: (data) => {
        this.services.push(data);
        this.toggleModal(false);
        this.resetForm();
      },
      error: (err) => alert('Error saving service: ' + err.message)
    });
  }

  deleteService(id: string): void {
    if (confirm('Are you sure you want to remove this service?')) {
      this.apiService.deleteService(id).subscribe({
        next: () => {
          this.services = this.services.filter(s => s._id !== id);
        },
        error: (err) => alert('Error deleting service: ' + err.message)
      });
    }
  }

  resetForm(): void {
    this.newService = {
      name: '',
      endpoint: '',
      method: 'GET',
      environment: 'dev',
      category: 'external',
      description: ''
    };
  }
}
