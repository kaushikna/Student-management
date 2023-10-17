import { Role } from "../Models";

export const payment = [
  {
    id: 1,
    value: "By Cash"
  },
  {
    id: 2,
    value: "By Online"
  }
];
export const grades = [
  {
    id: 1,
    value: "8th grade"
  },
  {
    id: 2,
    value: "Freshman"
  },
  {
    id: 3,
    value: "Sophomore"
  },
  {
    id: 4,
    value: "Junior"
  },
  {
    id: 5,
    value: "Senior"
  },
  {
    id: 6,
    value: "Others"
  }
];

export const plans = [
  {
    id: 1,
    code: 1,
    title: "One to One",
    class: "mdi-account",
    price: "$1600",
    unitPrice: 40,
    amount: 1600,
    hours: null,
    custom: false,
    value: "1-1",
    pages: ["payment", "event", "addbatch"]
  },
  {
    id: 2,
    code: 2,
    title: "Small Group",
    custom: false,
    class: "mdi-account-multiple",
    hours: null,
    price: "$1400",
    unitPrice: 40,
    amount: 1400,
    value: "Small Group",
    pages: ["payment", "event", "addbatch"]
  },
  {
    id: 3,
    code: 1,
    title: "Private Tutoring",
    custom: true,
    class: "mdi-account-multiple",
    hours: 5,
    price: "$200",
    unitPrice: 40,
    amount: 200,
    value: "1-1",
    pages: ["payment"]
  }
];
export const COUNTRIES = [
  {
    title: "USA",
    value: "US",
    pages: ["payment", "register", "add-student"]
  },
  {
    title: "India",
    value: "India",
    pages: ["payment", "register", "add-student"]
  }
];
export const roles = [
  {
    id: 1,
    title: "Admin",
    value: Role.ADMIN,
    pages: ["login"]
  },
  {
    id: 2,
    title: "Student",
    value: Role.STUDENT,
    pages: ["register", "login"]
  },
  {
    id: 3,
    title: "Tutor",
    pages: ["register", "login"],
    value: Role.TUTOR
  }
];


export const TROUBLE_PRIORITIES = [
  {
    title: "High",
    value: 0
  },
  {
    title: "Normal",
    value: 1
  },
  {
    title: "Low",
    value: 2
  }
];


export const TROUBLE_REQUEST_TYPES = [
  {
    title: "Payment Issue",
    value: 0
  },
  {
    title: "General Questions",
    value: 1
  },
  {
    title: "Technical Issue",
    value: 2
  },
  {
    title: "CutomerSupport",
    value: 3
  }
];


export const TROUBLE_REQUEST_STATUSES = [
  {
    title: "Assigned",
    value: 0
  },
  {
    title: "Researching",
    value: 1
  },
  {
    title: "Work in Progress",
    value: 2
  },
  {
    title: "Pending",
    value: 3
  },
  {
    title: "Resolved",
    value: 4
  }
];

export const TRANSACTION_STATUS = {
  0: "SCHEDULED",
  1: "NEW",
  2: "WAITING",
  3: "CONFIRMED",
  4: "SETTLED",
  5: "REJECTED",
  6: "PROCESSING",
  7: "BOUNCE",
  8: "LOST",
  9: "UNSUCCESSFUL",
  10: "REFUNDED",
};


export const PAYMENT_METHOD = {
  1: "ACH",
  2: "CASH",
  3: "CHEQUE",
  4: "CREDIT_CARD",
};

export const ORDER_STATUS = {
  0: "NEW",
  1: "IN_PROGRESS",
  2: "COMPLETED",
  3: "FAILED"
};
