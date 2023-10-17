import { TestConfig } from "./test-config";
import { Question } from "./question";

export class Test {
  id: number;
  name: string;
  description: string;
  config: TestConfig;
  questions: Question[];

  constructor(data: any) {
    if (data) {
      this.id = data[0].paperId._id;
      this.name = data[0].paperId.name;
      this.config = new TestConfig(data.config);
      this.questions = [];
      data.forEach((block) => {
        const paper = block.paperId.subject.filter((element) => {
          return element.subjectId === block.subjectId._id;
        });
        block.questions.forEach((q) => {
          q["type"] = block.type;
          q["passage"] = block.passage;
          q["subCat"] = block.subCat;
          q["time"] = paper[0].time;
          q["subjectId"] = block.subjectId;
          this.questions.push(new Question(q));
        });
      });
    }
  }
}
