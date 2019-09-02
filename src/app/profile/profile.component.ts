import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserAuthData } from '../auth/auth-data.model';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  isLoading = true;
  form: FormGroup;
  userData: UserAuthData;
  chart;

  private userId: string;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.form = new FormGroup({
      firstName: new FormControl(null, {
        validators: [Validators.required]
      }),
      lastName: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.userId = this.authService.getUserId();
    this.authService.getUserInfo(this.userId)
      .subscribe((user: UserAuthData) => {
        this.userData = user;
        this.form.setValue({
          firstName: user.firstName,
          lastName: user.lastName
        });
        this.getStats();
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
      });
  }

  formatCharts(graphData) {
    const currentDate = new Date();
    const currYear = currentDate.getFullYear();
    const currMonth = currentDate.getMonth();
    const lastMonth = currMonth - 1;
    const currDay = currentDate.getDate();

    // convert to UTC
    const startDate = Date.UTC(currYear, lastMonth, currDay);
    const endDate = Date.UTC(currYear, currMonth, currDay);

    this.initCharts(startDate, endDate, graphData);
  }

  initCharts(start, end, data) {
    this.chart = new Chart({
      chart: {
        type: 'datetime'
      },
      title: {
        text: 'Your visits for the previous month'
      },
      xAxis: {
        type: 'datetime',
        gridLineWidth: 1,
        min: start,
        max: end
      },
      credits: {
        enabled: false
      },
      series: [
        {
          name: 'Visits',
          data,
          type: 'line'
        }
      ]
    });
  }

  getStats() {
    this.authService.getUserStats(this.userData.email)
      .subscribe((stats: Array<any>) => {
        let graphData = [];

        stats.forEach(stat => {
          if (!stat) {
            return;
          }
          // add it to the data array
          graphData.push([stat.date, stat.entries]);
        });

        this.formatCharts(graphData);
      });
  }

  onUpdate() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.updateUser(
      this.userId,
      this.form.value.firstName,
      this.form.value.lastName
    );
  }
}
