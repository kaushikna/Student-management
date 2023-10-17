import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { COUNTRIES, plans as PLANS } from "src/app/metaData/metaData";
import { Role } from "src/app/Models";
import { AuthService } from "src/app/services/auth.service";
import { CommonService } from "src/app/services/common.service";
import { EntityService } from "src/app/services/entity.service";
import { EventService } from "src/app/services/event.service";
import { PaymentService } from "src/app/services/payment.service";
import { StudentService } from "src/app/services/student.service";
import { UserService } from "src/app/services/user.service";
import { UtilsService } from "src/app/services/utlils.service";
declare const $: any;

@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.scss"],
})
export class PaymentComponent implements OnInit {
  public currentUser: any;
  public order: any;
  public model: any = { data: [] };
  public batches: any[] = [];
  public countries: any = COUNTRIES.filter((country: any) =>
    country.pages.find((page: any) => page === "payment")
  );
  public states: any = [];
  public cities: any = [];
  public plans: any = PLANS.filter((plan: any) =>
    plan.pages.find((page: any) => page === "payment")
  );
  public selectedPromoCode: any = {
    value: 0,
  };
  steps: any[] = [
    {
      title: "Choose Plan",
      index: 1,
      active: true,
    },
    {
      title: "Order Summary ",
      index: 2,
      active: false,
    },
    {
      title: "Shipping Details",
      index: 3,
      active: false,
    },
    {
      title: "Make Payment",
      index: 4,
      active: false,
    },
  ];
  activeStep = 1;
  public orderModel: any = {
    quantity: 1,
    status: 1,
    orderType: 1,
    batchId: "",
    amount: PLANS[0].amount,
    couponCode: "",
    planType: 1,
    planId: 1,
    shippingAddress: {
      country: "USA",
    },
    billingAddress: {
      country: "USA",
    },
  };
  paymentModel: any = {
    userId: "",
    order: this.orderModel,
    email: "",
    cardNumber: "",
    cardExpirationDate: {},
    cardCode: "",
  };
  public users = [];
  public months = [];
  public years = [];
  public entities = [];
  @Output() submitTrigger = new EventEmitter();
  constructor(
    private eventService: EventService,
    private entityService: EntityService,
    private commonService: CommonService,
    private studentService: StudentService,
    private userService: UserService,
    private utilsService: UtilsService,
    private authService: AuthService,
    private toastr: ToastrService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    if (this.currentUser.role !== Role.STUDENT) {
      this.getEntities(() => {
        this.loadBatches();
        this.loadStudents();
      });
    } else {
      this.getEntities(() => {
        this.loadBatches();
      });
    }

    if (this.currentUser.role === Role.STUDENT) {
      this.getUserProfile();
    }
    for (const i of Array.from(Array(12).keys())) {
      this.months.push(i + 1);
    }
    for (const i of Array.from(Array(31).keys())) {
      this.years.push(i + new Date().getFullYear() + 1);
    }
  }

  public onExamTypeChange() {
    this.loadBatches();
    this.paymentModel.userId = "";
  }

  public getEntities(cb?: any) {
    this.entityService.getEntities().subscribe(
      (response) => {
        this.entities = response.data;
        this.orderModel.entityId = this.entities[0]._id;
        if (cb) {
          cb();
        }
      },
      (error) => {
        this.toastr.error(error.error.message, "find Failed", {
          timeOut: 3000,
        });
      }
    );
  }

  public getUserProfile(): void {
    this.userService.getProfile().subscribe((response: any) => {
      if (response) {
        this.assignAddress(response);
      }
    });
  }

  public onStepClick(index: number) {
    for (const step of this.steps) {
      if (step.index === 1) {
        continue;
      }
      if (step.index > index) {
        break;
      } else {
        if (this.isDisabled(step.index - 1)) {
          return;
        }
      }
    }

    this.steps.forEach((step) => {
      step.active = false;
      if (step.index === index) {
        step.active = true;
        this.activeStep = step.index;
      }
    });
  }

  /**
   * isDisabled
   */
  public isDisabled(stepIndex): boolean {
    const { planId, batchId, billingAddress, shippingAddress, hours } =
      this.orderModel;
    const { userId, cardNumber, cardCode, cardExpirationDate, email } =
      this.paymentModel;
    if (stepIndex === 1) {
      if (planId === 2) {
        return (
          !batchId || (this.currentUser.role === Role.ADMIN ? !userId : false)
        );
      } else if (planId === 3) {
        return hours < 5;
      } else {
        return this.currentUser.role === Role.ADMIN ? !userId : false;
      }
    } else if (stepIndex === 2) {
      return false;
    } else if (stepIndex === 3) {
      const { city, country, state, zip, address } = billingAddress;
      const {
        city: city2,
        country: country2,
        state: state2,
        zip: zip2,
        address: address2,
      } = shippingAddress;
      return (
        !city ||
        !country ||
        !state ||
        !zip ||
        !address ||
        !city2 ||
        !country2 ||
        !state2 ||
        !zip2 ||
        !address2
      );
    } else if (stepIndex === 4) {
      return !cardNumber || !cardCode || !cardExpirationDate || !email;
    }
  }

  public loadBatches() {
    this.eventService
      .getAvailableBatch({ entityId: this.orderModel.entityId })
      .subscribe((response) => {
        this.batches = response.data;
      });
  }

  public loadStudents() {
    this.studentService
      .getStudentList({ active: false })
      .subscribe((response) => {
        this.users = response;
      });
  }

  public onPlanChange(plan: any) {
    this.orderModel.planId = plan.id;
    this.orderModel.planType = plan.code;
    this.orderModel.amount = plan.amount;
    this.orderModel.hours = plan.hours;
  }

  public onAmountChange() {
    const currentPlan = this.plans.find(
      (plan: any) => plan.id === this.orderModel.planId
    );
    currentPlan.amount = currentPlan.unitPrice * currentPlan.hours;
    this.orderModel.amount = currentPlan.amount;
    this.orderModel.hours = currentPlan.hours;
  }

  public verifyCoupon() {
    const billAmount = this.orderModel.amount;
    this.paymentService
      .verifyCoupon({ billAmount, couponCode: this.selectedPromoCode.input })
      .subscribe((response) => {
        this.selectedPromoCode.value = response.data.discountedAmount;
      });
  }

  public makePayment() {
    const cardNumber = this.paymentModel.cardNumber.replaceAll("-", "");
    this.submitTrigger.next({ ...this.paymentModel, cardNumber });
  }

  public applyPromoCode() {
    this.verifyCoupon();
    this.orderModel.couponCode = this.selectedPromoCode.input;
    this.selectedPromoCode.title = this.selectedPromoCode.input;
    this.selectedPromoCode.input = "";
  }

  public clearPromoCode() {
    this.orderModel.couponCode = "";
    this.selectedPromoCode.title = null;
    this.selectedPromoCode.value = 0.0;
    this.selectedPromoCode.input = "";
  }

  /**
   * onInputChange
   */
  public onInputChange(event: any) {
    if (event.target.checked) {
      this.orderModel.billingAddress = { ...this.orderModel.shippingAddress };
    }
  }

  /**
   * getStates
   */
  public getStates(country: string) {
    return new Promise((resolve) => {
      this.utilsService.getStates({ country }).subscribe((response) => {
        this.states = response.data.sort(
          this.commonService.GetSortOrder("name")
        );
        return resolve(true);
      });
    });
  }

  /**
   * getCities
   */
  public getCities(state: any) {
    return new Promise((resolve) => {
      this.utilsService
        .getCities({ state: state._id })
        .subscribe((response) => {
          this.cities = response.data.sort(
            this.commonService.GetSortOrder("name")
          );
          return resolve(true);
        });
    });
  }

  onCountryChange(event, type: string) {
    const country = event.target.value;
    this.getStates(country).then(() => {
      if (type === "shipping") {
        this.orderModel.shippingAddress.state = "";
        this.orderModel.shippingAddress.city = "";
        this.orderModel.shippingAddress.zip = "";
      } else {
        this.orderModel.billingAddress.state = "";
        this.orderModel.billingAddress.city = "";
        this.orderModel.billingAddress.zip = "";
      }
    });
  }

  onStateChange(event, type: string) {
    const state = event.target.value;
    this.getCities(
      this.states.find((stateItem: any) => stateItem.name === state)
    ).then(() => {
      if (type === "shipping") {
        this.orderModel.shippingAddress.city = "";
        this.orderModel.shippingAddress.zip = "";
      } else {
        this.orderModel.billingAddress.city = "";
        this.orderModel.billingAddress.zip = "";
      }
    });
  }

  async onUserChange() {
    const user = this.users.find((userElement: any) => {
      return userElement._id === this.paymentModel.userId;
    });

    if (!user) {
      return;
    }
    await this.assignAddress(user);
  }

  public async assignAddress(user: any) {
    this.orderModel.shippingAddress.firstName = user.firstName;
    this.orderModel.shippingAddress.lastName = user.lastName;

    if (!user.country) {
      return;
    }

    this.orderModel.shippingAddress.country = user.country;
    await this.getStates(user.country);
    this.orderModel.shippingAddress.state = user.state;
    const state = this.states.find(
      (stateItem: any) => stateItem.name === user.state
    );
    await this.getCities(state);
    this.orderModel.shippingAddress.city = user.city;
    this.orderModel.shippingAddress.address = user.address;
    this.orderModel.shippingAddress.zip = user.zip;
  }
}
