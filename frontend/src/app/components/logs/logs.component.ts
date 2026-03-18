import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
  logs: any[] = [];
  filterQuery = '';
  selectedLog: any = null;

  constructor(private logService: LogService) { }

  ngOnInit(): void {
    this.fetchLogs();
    
    // Also listen for live logs while on this page
    this.logService.onNewLog().subscribe(log => {
      this.logs.unshift(log);
    });
  }

  fetchLogs(): void {
    this.logService.getLogs().subscribe({
      next: (data) => this.logs = data,
      error: (err) => console.error('Error fetching logs:', err)
    });
  }

  get filteredLogs(): any[] {
    if (!this.filterQuery) return this.logs;
    const query = this.filterQuery.toLowerCase();
    return this.logs.filter(log => 
      log.endpoint.toLowerCase().includes(query) || 
      log.status.toString().includes(query) ||
      (log.method && log.method.toLowerCase().includes(query))
    );
  }

  selectLog(log: any): void {
    this.selectedLog = log;
  }

  exportToCSV(): void {
    this.logService.exportLogs().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `servicehub_logs_${new Date().getTime()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => alert('Error exporting logs: ' + err.message)
    });
  }
}
