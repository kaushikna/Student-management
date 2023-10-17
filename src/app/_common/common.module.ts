// Angular
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

// Components Routing
import { CommonModule } from "@angular/common";
import { PaymentComponent } from "./payment/payment.component";
import { OrdersComponent } from "../student/student-orders/orders.component";
import { NgxPaginationModule } from "ngx-pagination";
import { CreditCardDirective } from "../_shared/interfaces/directives/creditcard.directive";
import { PhoneDirective } from "../_shared/interfaces/directives/phone.directive";
import { NumbersOnlyDirective } from "../_shared/interfaces/directives/number.directive";
import { SmartModal2Component } from "../utilities/smart-modal2/smart-modal2.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgxPaginationModule
    ],
    declarations: [
        PaymentComponent,
        CreditCardDirective,
        NumbersOnlyDirective,
        OrdersComponent,
        PhoneDirective,
        SmartModal2Component
    ],
    exports: [PaymentComponent, OrdersComponent, PhoneDirective, NumbersOnlyDirective, SmartModal2Component]
})
export class CommonUtilsModule { }
