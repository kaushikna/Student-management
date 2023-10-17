import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APIService } from "./api.service";

@Injectable({
  providedIn: "root",
})
export class EntityService extends APIService {
  getEntities(): Observable<any> {
    return this.get(this.API_URL + "entities");
  }
  addEntity(payload: any): Observable<any> {
    return this.post(this.API_URL + "entities", payload);
  }
}
