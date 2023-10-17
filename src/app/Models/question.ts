import { Option } from "./option";

export class Question {
  id: number;
  name: string;
  image: string;
  questionTypeId: number;
  options: Option[];
  answered: boolean;
  marks: number;
  type: number;
  optionsType: string;
  questionNum: number;
  time: string;
  subCat: string;
  subjectId;
  passage;

  constructor(data: any) {
    data = data || {};
    this.id = data._id;
    this.name = data.name;
    this.image = data.image;
    this.subjectId = data.subjectId;
    this.type = data.type;
    this.time = data.time;
    this.subCat = data.subCat;
    this.passage = data.passage;
    this.marks = data.marks;
    this.questionTypeId = data.questionTypeId;
    this.questionNum = data.questionNum;
    this.optionsType = data.optionsType;
    this.options = [];
    let i = 0;
    data.options.forEach((o) => {
      o["questionId"] = data.questionNum;
      o["isAnswer"] = false;
      const { selectedOption } = o;
      if (selectedOption && parseInt(selectedOption, 0) === i || (o.selectedOption === "true" || o.selectedOption === true)) {
        o["isAnswer"] = true;
      }
      i++;
      this.options.push(new Option(o));
    });
  }
}
