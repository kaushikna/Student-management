import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TestPaperService } from "../../services/test-paper.service";
@Component({
  selector: "app-view-test-paper",
  templateUrl: "./view-test-paper.component.html",
  styleUrls: ["./view-test-paper.component.css"],
})
export class ViewTestpapersComponent implements OnInit {
  currentTestObj: any;
  constructor(private testService: TestPaperService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {

    this.activatedRoute.params.subscribe((params) => {
      this.testService.getPaper(params.id).subscribe((response) => {
        this.currentTestObj = response.data;
      });
    });
  }

  startTest() {
    this.router.navigate(["smart-student/start-test", this.currentTestObj._id]);
  }

}
