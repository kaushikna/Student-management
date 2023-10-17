import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, ViewChild, OnInit, TemplateRef} from '@angular/core';

import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';



import { EventService } from 'src/app/services/event.service';
import { PaginationInstance } from 'ngx-pagination';

declare const $: any;


@Component({
  selector: 'app-eventcalander',
  templateUrl: './eventcalander.component.html',
  styleUrls: ['./eventcalander.component.css']
})
export class EventcalanderComponent implements OnInit {

  model: any = {
    data: [],
    data2: [],
  };
  finalarray = []
  mainarray: any

  public paginationConfig2: PaginationInstance = {
    id: "paginationListId2",
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: this.model.data2.length
  };
  calendarOptions: Options;
 displayEvent: any;
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
  @ViewChild('viewevents') viewevents: TemplateRef<any>;

  constructor(protected eventService: EventService,private modal:NgbModal) { }

  ngOnInit(){
   
    const query = {
      page: this.paginationConfig2.currentPage,
      pageSize: this.paginationConfig2.itemsPerPage
    };
    this.eventService.getSchedules(query).subscribe(response => {

      this.mainarray = response.data

      this.mainarray.filter((data: any) => {

        const date = new Date(data.scheduleDate + "T00:00:00Z");
        const istDate = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
        const formattedDate = istDate;
        const eventcalnderdata = {
          title: 'Subject: '+ data.subjectDetails.name + ' Teacher name: ' + data.teacherDetails.name,
          BatchName: data.batchDetails.batchName,
          TeacherName: data.teacherDetails.name,
          SubjectDetails: data.subjectDetails.name,
          start: formattedDate,
          
        }
        this.finalarray.push(eventcalnderdata)
      })
  
      this.calendarOptions = {
        editable: true,
        eventLimit: false,
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay,listMonth'
        },
        events: this.finalarray,
        selectable: true
      };
    });
  }

     dayRender ( cell) {
     
      let btn = document.createElement( "button" );
      btn.textContent = 'myButton';
      cell.append(btn);
    }




  clickButton(model: any) {
    this.displayEvent = model;
  }
  eventClick(model: any) {
    
    model = {
      event: {
        id: model.event.id,
        start: model.event.start,
        title: model.event.title ,
        BatchName:model.event.BatchName,
        SubjectDetails:model.event.SubjectDetails
      },
     
    }
    this.modal.open(this.viewevents, { size: 'lg' });

    this.displayEvent = model;
  }
  updateEvent(model: any) {
    model = {
      event: {
        id: model.event.id,
        start: model.event.start,
        title: model.event.title,
        BatchName:model.event.BatchName,
        SubjectDetails:model.event.SubjectDetails
      },
    
    }
    this.displayEvent = model;
  }

  dayClick(event) {
    console.log('dayClick', event);
  }

}
