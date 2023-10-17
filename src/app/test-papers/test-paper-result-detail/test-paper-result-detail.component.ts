import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TestPaperService } from 'src/app/services/test-paper.service';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

interface ResultItem {
  _id: string;
  name: string;
}
interface TestResult {
  subject: ResultItem[];
  total: number;
  answers: any[];
  paperId: string;
}
@Component({
  selector: 'app-test-paper-result-detail',
  templateUrl: './test-paper-result-detail.component.html',
  styleUrls: ['./test-paper-result-detail.component.css']
})
export class TestPaperResultDetailComponent implements OnInit {

  testResult: TestResult;
  question: any = {};
  questions: any = [];
  subjectId: string;
  view = 0;
  loading = false;
  tabs: any[] = ["Summary"];
  answersObj: any = {};

  barChartOptions: ChartOptions = {
    responsive: true,
    onClick: (_, activeElements: any) => {
      const e: any = activeElements[0]._index;
      this.onClickGraph(e);
    },
    scales: {
      yAxes: [
        {
          ticks: {
            min: 0,
          }
        }
      ]
    },
  };
  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataSets[] = [
    { data: [], label: 'Subject Wise', backgroundColor: "#69b3a2"  }
  ];

  barChartOptions2: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [
        {
          ticks: {
            min: 0,
          }
        }
      ]
    },
  };
  barChartLabels2: Label[] = [];
  barChartType2: ChartType = 'horizontalBar';
  barChartLegend2 = true;
  barChartPlugins2 = [];
  barChartData2: ChartDataSets[] = [
    { data: [], label: '', backgroundColor: "#69b3a2" }
  ];



  constructor(private testService: TestPaperService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.getTestPaperResult(params.id);
    });
  }

  getTestPaperResult(id: string): void {
    this.testService.getTestResultById(id).subscribe((response: any) => {
      this.testResult = response.data;
      this.tabs = [...this.tabs, ...this.testResult.subject.map((subject: ResultItem) => subject.name)];
      this.subjectId = this.testResult.subject[0]._id;
      this.getQuestions();

      this.testResult.subject.forEach((subject: any) => {
        this.barChartLabels.push(subject.name);
        this.barChartData[0].data.push(subject.correctQuestion);
      });
      this.barChartOptions.scales.yAxes[0].ticks.max = this.testResult.total;

      this.answersObj = this.testResult.answers.reduce((a, e) => {
        const { correct, questionNum, subject } = e;
        const subjectId = this.testResult.subject.find((subjectItem) => subjectItem.name === subject)._id;
        a[subjectId] = a[subjectId] || {};
        a[subjectId][questionNum] = { correct: correct === "correct", selectedOptions: e.selectedOptions };
        return a;
      }, {});

      console.log(this.answersObj);

      this.onClickGraph(0);

    });
  }

  onClickGraph(index) {
    const subjectName = this.testResult.subject[index].name;
    const answers = this.testResult.answers
      .filter((a) => a.subject === subjectName)
      .reduce((a, e) => {
        const { subCat, correct } = e;
        a.total = a.total || 0;
        a.correct = a.correct || 0;
        a[subCat] = a[subCat] || { correct: 0, total: 0 };
        a[subCat].correct += correct === "correct" ? 1 : 0;
        a.correct += correct === "correct" ? 1 : 0;
        a[subCat].total++;
        a.total++;
        return a;
      }, {});

    this.barChartLabels2 = [];
    this.barChartData2[0].data = [];
    const keys = ["total", "correct"];
    Object.keys(answers).forEach((key) => {
      if (!keys.includes(key)) {
        this.barChartLabels2.push(key);
        this.barChartData2[0].data.push(answers[key].correct);
      }
    });
    this.barChartData2[0].label = subjectName;

    this.barChartOptions2.scales.xAxes[0].ticks.max = answers.total;
  }


  getQuestions(): void {


    if (this.subjectId === this.question.subjectId) {
      return;
    }

    this.loading = true;

    const payload = {
      subjectId: this.subjectId, paperId: this.testResult.paperId
    };
    this.testService.getQuestions(payload).subscribe((response: any) => {
      const questions = response.data;
      let index = 0;
      this.questions = [];
      questions.forEach((question: any) => {
        const { paperId, subjectId, type } = question;

        question.questions.forEach((questionItem: any) => {

          const options = questionItem.options.map((option: any, index2: number) => {
            const { selectedOptions } = this.answersObj[subjectId][questionItem.questionNum];
            let answered = 0;
            if (index2 === parseInt(option.selectedOption, 0)) {
              option.correct = 1;
              if (selectedOptions && selectedOptions[0] && selectedOptions[0] === option._id) {
                answered = 1;
              }
            } else {
              if (selectedOptions && selectedOptions[0] && selectedOptions[0] === option._id) {
                answered = -1;
              }
            }
            option.answered = answered;
            return option;
          });

          const correct = options.find((option: any) => {
            return option.correct === 1 && option.answered === 1;
          });

          const obj = {
            type,
            subjectId,
            correct,
            paperId,
            index,
            marks: questionItem.marks,
            options,
            question: questionItem.name,
            subCat: question.subCat
          };

          // Passage
          if (type === 1) {
            this.questions.push({
              ...obj,
              type,
              passageText: question.passage.passageText,
              passage: question.passage.title,
            });
          } else {
            this.questions.push({
              ...obj,
              type,
              passage: null,
            });
          }
          index++;
        });
      });
      this.question = this.questions[0] || {};
      this.loading = false;

    });
  }

  onTabClick(index: number) {
    if (index !== 0) {
      this.subjectId = this.testResult.subject[index - 1]._id;
      this.getQuestions();
    }
  }

  onClickQuestion(index: number) {
    this.question = this.questions[index];
  }

}
