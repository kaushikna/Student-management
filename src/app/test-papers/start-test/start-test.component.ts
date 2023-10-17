import { Component, OnInit, HostListener } from "@angular/core";
import { Option } from "../../Models/option";
import { Question } from "../../Models/question";
import { Test } from "../../Models/test";
import { TestConfig } from "../../Models/test-config";

import { TestPaperService } from "../../services/test-paper.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/services/auth.service";
import { Role } from "src/app/Models";

@Component({
  selector: "app-start-test",
  templateUrl: "./start-test.component.html",
  styleUrls: ["./start-test.component.css"],
})
export class StartTestComponent implements OnInit {
  tests: any[];
  p = 1;
  test: Test = new Test(null);
  mode = "test";
  editorContent: string;
  testName: string;
  submitButtonText = "Submit";
  config: TestConfig = {
    allowBack: true,
    allowReview: true,
    autoMove: false, // if true, it will move to next question automatically when answered.
    duration: 120, // indicates the time (in secs) in which test needs to be completed. 0 means unlimited.
    pageSize: 1,
    requiredAll: false, // indicates if you must answer all the questions before submitting.
    richText: false,
    shuffleQuestions: false,
    shuffleOptions: false,
    showClock: false,
    showPager: true,
    theme: "none",
  };

  pager = {
    index: 0,
    size: 1,
    count: 1,
  };
  timer: any = null;
  startTime: Date;
  endTime: Date;
  ellapsedTime = "00:00";
  duration = "";
  quesCat = { sub: [] };
  questionArr = [];
  answers = [];
  paused = "Pause";
  pausedTime;
  pausedTimeDiff = 100000; // 1 minute in ms
  finalResult = [];
  TotalMarks = 0;
  TotalMarksObtained = 0;
  currentUser: any = {};
  preview = false;

  constructor(
    private testService: TestPaperService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getUser();
    this.activatedRoute.params.subscribe((params) => {
      this.testName = params.name;
    });
    this.loadTest(this.testName);
    if (this.currentUser.role === Role.ADMIN) {
      this.submitButtonText = "Done";
      this.preview = true;
    }
  }

  @HostListener("window:beforeunload", ["$event"])
  unloadNotification($event: any) {
    if (this.timer) {
      localStorage.pausedTimeDiff = this.pausedTimeDiff;
      localStorage.startTime = this.startTime;
      $event.returnValue = true;
    }
  }

  loadTest(testName: string) {
    this.testService.getAllQuestionsPopulate(testName).subscribe((res) => {
      res.data.config = this.config;
      this.test = new Test(res.data);
      this.test.questions.forEach((quest) => {
        const subid = quest.subjectId._id;
        if (!this.quesCat[subid]) {
          this.quesCat.sub.push(subid);
          this.quesCat[subid] = [];
        }
        this.quesCat[subid].push(quest);
      });
      this.startTimeLoop();
    });
    this.mode = "test";
  }
  startTimeLoop() {
    clearInterval(this.timer);
    if (this.quesCat.sub.length > 0) {
      const item = this.quesCat.sub.shift();
      this.p = 1;
      this.timeLoop(this.quesCat[item]);
    } else {
      return;
    }
  }
  timeLoop(res) {
    // console.log(
    //   "local ",
    //   localStorage["startTime"],
    //   localStorage["pausedTimeDiff"]
    // );
    const storgeStartTime = localStorage.getItem("startTime");
    this.questionArr = res;
    // this.filteredQuestions;
    this.pager.count = res.length; // this.test.questions.length;
    if (storgeStartTime) {
      this.startTime = new Date(storgeStartTime);
      localStorage.removeItem("startTime");
    } else {
      this.startTime = new Date();
    }
    this.ellapsedTime = "00:00";
    this.duration = this.parseTime(res[0].time * 60);
    this.timer = setInterval(() => {
      this.tick();
    }, 1000);

    this.config.duration = res[0].time * 60;
  }

  pauseTimer() {
    // console.log(
    //   this.timer,
    //   this.startTime,
    //   this.ellapsedTime,
    //   this.paused,
    //   this.pausedTimeDiff
    // );
    let timeOut;
    let diff;
    if (this.paused === "Pause") {
      this.paused = "Resume";
      this.pausedTime = new Date();
      clearInterval(this.timer);
      timeOut = setTimeout(() => {
        this.paused = "Pause";
        if (this.pausedTime) {
          const now = new Date();
          diff = (now.getTime() - this.pausedTime.getTime()) / 1000;
          if (localStorage.pausedTimeDiff) {
            this.pausedTimeDiff = parseInt(
              localStorage.getItem("pausedTimeDiff"),
              0
            );
            localStorage.removeItem("pausedTimeDiff");
          }
          this.pausedTimeDiff = this.pausedTimeDiff - diff * 1000;
          this.startTime.setSeconds(this.startTime.getSeconds() + diff);
        }
        this.timer = setInterval(() => {
          this.tick();
        }, 1000);
      }, this.pausedTimeDiff);
    } else {
      clearTimeout(timeOut);
      if (this.pausedTime) {
        const now = new Date();
        diff = (now.getTime() - this.pausedTime.getTime()) / 1000;
        if (localStorage.pausedTimeDiff) {
          this.pausedTimeDiff = parseInt(
            localStorage.getItem("pausedTimeDiff"),
            0
          );
          localStorage.removeItem("pausedTimeDiff");
        }
        this.pausedTimeDiff = this.pausedTimeDiff - diff * 1000;
        this.startTime.setSeconds(this.startTime.getSeconds() + diff);
      }
      this.paused = "Pause";
      this.timer = setInterval(() => {
        this.tick();
      }, 1000);
    }
    // console.log(
    //   this.timer,
    //   this.startTime,
    //   this.ellapsedTime,
    //   this.pausedTimeDiff
    // );
  }
  endTimer() {
    this.onSubmit();
  }
  tick() {
    const now = new Date();
    const diff = (now.getTime() - this.startTime.getTime()) / 1000;
    if (diff >= this.config.duration) {
      console.log("===", diff, this.config.duration);
      this.onSubmit();
    }
    this.ellapsedTime = this.parseTime(diff);
  }

  parseTime(totalSeconds: number) {
    let mins: string | number = Math.floor(totalSeconds / 60);
    let secs: string | number = Math.round(totalSeconds % 60);
    mins = (mins < 10 ? "0" : "") + mins;
    secs = (secs < 10 ? "0" : "") + secs;
    return `${mins}:${secs}`;
  }

  get filteredQuestions() {
    // let question = this.test.questions
    //   ? this.test.questions.slice(
    //       this.pager.index,
    //       this.pager.index + this.pager.size
    //     )
    //   : [];
    // if (question && question.length && question[0].type) {
    //   this.editorContent = question[0].passage.passageText;
    // }

    this.pager.count = this.questionArr
      ? this.questionArr.length
      : this.pager.count;
    return this.questionArr;
  }

  onSelect(question: Question, option: Option) {
    if (question.questionTypeId === 1) {
      question.options.forEach((x) => {
        if (x.id !== option.id) {
          x.selected = false;
        }
      });
    }

    if (this.config.autoMove) {
      this.goTo(this.pager.index + 1);
    }
  }

  goTo(index: number) {
    if (index >= 0 && index < this.pager.count) {
      this.pager.index = index;
      this.mode = "test";
    }
  }

  isAnswered(question: Question) {
    return question.options.find((x) => x.selected)
      ? "Answered"
      : "Not Answered";
  }

  async isCorrect(question: Question) {
    const { optionsType, options } = question;
    if (parseInt(optionsType, 0) === 0) {
      const isCorrectAnswer = options.find((option: Option) => {
        return option.selected === option.selectedOption && option.isAnswer;
      });
      return isCorrectAnswer ? "correct" : "wrong";
    } else {
      let isCorrectAnswer = true;
      for (const option of options) {
        if (option.isAnswer !== !!option.selected) {
          isCorrectAnswer = false;
          break;
        }
      }
      return isCorrectAnswer ? "correct" : "wrong";
    }
  }

  async onSubmit() {
    clearInterval(this.timer);
    const resData = { total: 0, totalMarksObtained: 0 };
    for (const quest of this.questionArr) {
      const subName = quest.subjectId.name;
      const answer = await this.isCorrect(quest);
      const selectedOptions = quest.options
        .filter((option) => option.selected)
        .map((option) => option.id);
      this.answers.push({
        testId: this.test.id,
        questionId: quest.id,
        subCat: quest.subCat,
        questionNum: quest.questionNum,
        marks: quest.marks,
        subject: subName,
        correct: answer,
        selectedOptions,
      });
    }
    // console.log("ans", this.answers);
    if (this.quesCat.sub.length > 0) {
      // const item = this.quesCat.sub[this.quesCat.sub.length - 1];
      // const subject = this.quesCat[item][0].subjectId.name;
      this.toastr.success(
        `Next paper will be starting in 10 seconds`, // ${subject}!
        "Next",
        {
          timeOut: 10000,
        }
      );
      setTimeout(() => {
        this.startTimeLoop();
      }, 10000);
    } else {
      for (const ans of this.answers) {
        resData.total = resData.total + ans.marks;
        const subName = ans.subject;
        if (!resData[subName]) {
          resData[subName] = {
            name: subName,
            total: 0,
            correctMarks: 0,
            totalQuestion: 0,
            correctQuestion: 0,
          };
        }
        resData[subName].total += ans.marks;
        resData[subName].totalQuestion += 1;
        if (ans.correct === "correct") {
          resData.totalMarksObtained = resData.totalMarksObtained + ans.marks;
          resData[subName].correctMarks += ans.marks;
          resData[subName].correctQuestion += 1;
        }
      }
      this.TotalMarks = resData.total;
      this.TotalMarksObtained = resData.totalMarksObtained;

      Object.keys(resData).forEach((key) => {
        if (key !== "total" && key !== "totalMarksObtained") {
          this.finalResult.push(JSON.parse(JSON.stringify(resData[key])));
        }
      });

      const resObj = {
        studentId: "",
        paperId: this.test.id,
        result: resData,
        answers: this.answers,
      };

      if (this.currentUser.role === Role.STUDENT) {
        this.testService.saveresult(resObj).subscribe((response: any) => {
          this.router.navigate(["/smart-student/result", response.data._id]);
        });
      } else {
        this.router.navigate(["/admin/testpapers"]);
      }
    }
  }
  OnDestroy() {
    clearInterval(this.timer);
  }
}
