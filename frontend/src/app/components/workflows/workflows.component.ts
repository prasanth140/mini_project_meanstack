import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkflowService } from '../../services/workflow.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-workflows',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workflows.component.html',
  styleUrls: ['./workflows.component.css']
})
export class WorkflowsComponent implements OnInit {
  workflows: any[] = [];
  availableServices: any[] = [];
  selectedWorkflow: any = null;
  executing = false;
  executionResults: any = null;
  
  showCreateModal = false;
  newWorkflow: any = {
    name: '',
    steps: []
  };

  constructor(
    private workflowService: WorkflowService,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.fetchWorkflows();
    this.fetchServices();
  }

  fetchWorkflows(): void {
    this.workflowService.getWorkflows().subscribe({
      next: (data) => this.workflows = data,
      error: (err) => console.error('Error fetching workflows:', err)
    });
  }

  fetchServices(): void {
    this.apiService.getServices().subscribe({
      next: (data) => this.availableServices = data,
      error: (err) => console.error('Error fetching services:', err)
    });
  }

  selectWorkflow(wf: any): void {
    this.selectedWorkflow = wf;
    this.executionResults = null;
  }

  addStep(): void {
    this.newWorkflow.steps.push({
      name: `Step ${this.newWorkflow.steps.length + 1}`,
      serviceId: '',
      order: this.newWorkflow.steps.length
    });
  }

  removeStep(index: number): void {
    this.newWorkflow.steps.splice(index, 1);
  }

  saveWorkflow(): void {
    if (!this.newWorkflow.name || this.newWorkflow.steps.length === 0) {
      alert('Please provide a name and at least one step');
      return;
    }

    this.workflowService.createWorkflow(this.newWorkflow).subscribe({
      next: (data) => {
        this.fetchWorkflows();
        this.showCreateModal = false;
        this.newWorkflow = { name: '', steps: [] };
      },
      error: (err) => alert('Error saving workflow: ' + err.message)
    });
  }

  runWorkflow(): void {
    if (!this.selectedWorkflow) return;
    
    this.executing = true;
    this.executionResults = null;
    
    this.workflowService.executeWorkflow(this.selectedWorkflow._id).subscribe({
      next: (data) => {
        this.executing = false;
        this.executionResults = data;
      },
      error: (err) => {
        this.executing = false;
        alert('Workflow execution failed: ' + err.message);
      }
    });
  }
}
