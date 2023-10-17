import { Component, OnInit, ViewChild } from '@angular/core';
import { ApexTitleSubtitle, ChartComponent } from "ng-apexcharts";

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexFill,
  ApexDataLabels,
  ApexLegend
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  fill: ApexFill;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  title:ApexTitleSubtitle
};
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  constructor() {
    this.chartOptions = {
      series: [44, 55, 41, 17, 15],
      chart: {
        width: 480,
        type: "donut"
      },
    
      dataLabels: {
        enabled: false
      },
      fill: {
        type: "gradient",
      },
      legend: {
        formatter: function(val, opts) {
          return val + " - " + opts.w.globals.series[opts.seriesIndex];
        }
      }, 
      title: {
        text: 'Total Teacher Assigned',
        align: 'center',
        style: {
          fontSize: '18px',
          fontWeight: 'bold',
          fontFamily: 'Arial, sans-serif',
          color: '#333'
        }},
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            },
            title: {
              text: "Total Teacher Assigned",
              align: "center"
            },
          }
        }
      ]
    };
  }
  ngOnInit(): void {
  }
}
