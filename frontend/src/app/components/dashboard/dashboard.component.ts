import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LogService } from '../../services/log.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: any;
  liveLogs: any[] = [];
  successRate: number = 0;
  maxRequests: number = 1;
  private logSubscription: Subscription | undefined;

  constructor(private logService: LogService) { }

  ngOnInit(): void {
    this.fetchStats();
    this.fetchRecentLogs();
    
    // Subscribe to live updates via Socket.io
    this.logSubscription = this.logService.onNewLog().subscribe(log => {
      this.liveLogs.unshift(log);
      if (this.liveLogs.length > 10) this.liveLogs.pop();
      this.fetchStats(); // Update stats in real-time
    });
  }

  fetchRecentLogs(): void {
    this.logService.getLogs().subscribe({
      next: (logs) => {
        this.liveLogs = logs.slice(0, 10);
      },
      error: (err) => console.error('Error fetching initial logs:', err)
    });
  }

  ngOnDestroy(): void {
    if (this.logSubscription) {
      this.logSubscription.unsubscribe();
    }
  }

  fetchStats(): void {
    this.logService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.calculateSecondaryStats();
      },
      error: (err) => console.error('Error fetching stats:', err)
    });
  }

  calculateSecondaryStats(): void {
    if (this.stats && this.stats.total > 0) {
      this.successRate = Math.round((this.stats.success / this.stats.total) * 100);
      
      if (this.stats.dailyStats && this.stats.dailyStats.length > 0) {
        this.maxRequests = Math.max(...this.stats.dailyStats.map((d: any) => d.count));
      }
    }
  }
}
