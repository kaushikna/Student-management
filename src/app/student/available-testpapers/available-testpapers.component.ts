import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { TestPaperService } from "../../services/test-paper.service";
@Component({
  selector: "app-available-testpapers",
  templateUrl: "./available-testpapers.component.html",
  styleUrls: ["./available-testpapers.component.css"],
})
export class AvailableTestpapersComponent implements OnInit {
  tests: any[] = [];
  constructor(private testService: TestPaperService, private router: Router) { }

  ngOnInit() {
    this.testService.getAllPaperForStudent().subscribe((response) => {
      this.tests = response.data;
    });
  }

  loadTest(id: string) {
    this.router.navigate(["smart-student/start-test/preview", id]);
  }
  loadResult(id: string) {
    this.router.navigate(["smart-student/result", id]);
  }
}
