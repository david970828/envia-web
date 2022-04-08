import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable()
export class ColombiaService {

  constructor(private http: HttpClient) { }

  readConfigurationColombia(): Observable<any> {
    return this.http.get(environment.apiCountry).pipe((response: any) => response);
  }
}
