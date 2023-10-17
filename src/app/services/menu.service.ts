import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APIService } from "./api.service";

@Injectable({
  providedIn: "root",
})
export class MenuService extends APIService {
  entity = "menus";
  getAllMenus(): Observable<any> {
    return this.get(this.API_URL + this.entity);
  }
  addMenu(payload: any): Observable<any> {
    return this.post(this.API_URL + this.entity, payload);
  }
  updateMenu(payload: any): Observable<any> {
    return this.put(this.API_URL + this.entity + "/" + payload._id, payload);
  }
}
