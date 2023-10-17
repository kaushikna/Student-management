export class Option {
  id: number;
  questionId: number;
  name: string;
  image: string;
  isAnswer: boolean;
  selected: boolean;
  selectedOption: any;
  entryType: number;
  constructor(data: any) {
    data = data || {};
    this.id = data._id;
    this.image = data.entryImage;
    this.questionId = data.questionId;
    this.name = data.entryText;
    this.selectedOption = data.selectedOption;
    this.entryType = data.entryType;
    this.isAnswer = data.isAnswer;
  }
}
