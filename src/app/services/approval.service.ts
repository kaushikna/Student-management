import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APIService } from "./api.service";

@Injectable({
  providedIn: "root",
})
export class ApprovalService extends APIService {
  entity = "approvals";
  getAllApprovals(): Observable<any> {
    return this.get(this.API_URL + this.entity);
  }
  approveParent(payload: any): Observable<any> {
    return this.post(this.API_URL + this.entity, payload);
  }
}
