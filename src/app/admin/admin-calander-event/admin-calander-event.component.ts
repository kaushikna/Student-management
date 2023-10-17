import { Component, ViewChild, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import { EventService } from 'src/app/services/event.service';
import { PaginationInstance } from 'ngx-pagination';



@Component({
  selector: 'app-admin-calander-event',
  templateUrl: './admin-calander-event.component.html',
  styleUrls: ['./admin-calander-event.component.css']
})
export class AdminCalanderEventComponent implements OnInit {

  mainarray: any
  @ViewChild('AddnnewEvents') AddnnewEvents: TemplateRef<any>;
  @ViewChild('viewevents') viewevents: TemplateRef<any>;

  

  model: any = {
    data: [],
    data2: [],
  };
  finalarray = []

  public paginationConfig2: PaginationInstance = {
    id: "paginationListId2",
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: this.model.data2.length
  };
  calendarOptions: Options;
 displayEvent: any;
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
  constructor(protected eventService: EventService,private modal:NgbModal) { }

  ngOnInit(){
   
    const query = {
      page: this.paginationConfig2.currentPage,
      pageSize: this.paginationConfig2.itemsPerPage
    };
    this.eventService.getSchedules(query).subscribe((response) => {
      this.mainarray = response.data

      this.mainarray.filter((data: any) => {

        const date = new Date(data.scheduleDate + "T00:00:00Z");
        const istDate = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
        const formattedDate = istDate;
        const eventcalnderdata = {
          title: data.batchDetails.student.firstName + " " + data.batchDetails.student.lastName,
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
        // other params
      },
    
    }
    this.displayEvent = model;
  }

  dayClick(event) {
    console.log('dayClick', event);
  }



 
  

 

 
  addNewevnts() {
    this.modal.open(this.AddnnewEvents, { size: 'lg' });
  }

}
