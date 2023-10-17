import { Component, Input, AfterContentInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';

import {
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexChart,
  ApexPlotOptions,
  ApexLegend,
  ChartComponent
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  colors: string[];
};

@Component({
  selector: 'app-dashboard-management',
  templateUrl: './dashboard-management.component.html',
  styleUrls: ['./dashboard-management.component.css']
})
export class DashboardManagementComponent implements AfterContentInit {
  
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  

  @Input() data: any;
  listItems: any[] = [];
  
  

  listItemsMap: any = {
    
    teachers: {
      title: "Teachers",
      routeTitle: "Teachers Management",
      key: "teachers",
      path: "/admin/teacher-management"
    },
    students: {
      title: "Students",
      routeTitle: "Students Management",
      key: "students",
      path: "/admin/student-management"
    },
    subjects: {
      title: "Subjects",
      routeTitle: "Subjects Management",
      key: "subjects",
      path: "/admin/subjects"
    },
    classes: {
      title: "Events",
      routeTitle: "Event Management",
      key: "classes",
      path: "/admin/event-managementtt"
    },
    batches: {
      title: "Batches",
      routeTitle: "Batch Management",
      key: "batches",
      path: "/admin/event-management"
    },
    papers: {
      title: "Test Papers ",
      routeTitle: "Test Paper Management",
      key: "papers",
      path: "/admin/testpapers"
    },
    orders: {
      title: "Orders",
      routeTitle: "Order Management",
      key: "orders",
      path: "/admin/orders"
    },
    tickets: {
      title: "Open Troubles",
      routeTitle: "Trouble Management",
      key: "tickets",
      path: "/admin/troubles"
    },
  };
  constructor(private router: Router) { 
    this.chartOptions = {
      series: [
        {
          data: [
            {
              x: "New Delhi",
              y: 218
            },
            {
              x: "Kolkata",
              y: 149
            },
            {
              x: "Mumbai",
              y: 184
            },
            {
              x: "Ahmedabad",
              y: 55
            },
            {
              x: "Bangaluru",
              y: 84
            },
            {
              x: "Pune",
              y: 31
            },
            {
              x: "Chennai",
              y: 70
            },
            {
              x: "Jaipur",
              y: 30
            },
            {
              x: "Surat",
              y: 44
            },
            {
              x: "Hyderabad",
              y: 68
            },
            {
              x: "Lucknow",
              y: 28
            },
            {
              x: "Indore",
              y: 19
            },
            {
              x: "Kanpur",
              y: 29
            }
          ]
        }
      ],
      legend: {
        show: false
      },
      chart: {
        height: 350,
        type: "treemap"
      },
      title: {
        text: "Category",
        align: "center"
      },
      colors: [
        "#3B93A5",
        "#F7B844",
        "#ADD8C7",
        "#EC3C65",
        "#CDD7B6",
        "#C1F666",
        "#D43F97",
        "#1E5D8C",
        "#421243",
        "#7F94B0",
        "#EF6537",
        "#C0ADDB"
      ],
      plotOptions: {
        treemap: {
          distributed: true,
          enableShades: false
        }
      }
   
  

 

}  
}
  ngAfterContentInit() {
    for (const key in this.data) {
      if (this.data.hasOwnProperty(key)) {
        const item = this.listItemsMap[key];
        if (item) {
          item.value = this.data[key];
          this.listItems.push(item);
        }
      }
    }
  }
  public generateData(count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = "w" + (i + 1).toString();
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
  
      series.push({
        x: x,
        y: y
      });
      i++;
    }
    return series;
  }
  ngOnInit() {
  
    
    }
  onClick(listItem: any) {
    this.router.navigate([listItem.path]);
  }
}
