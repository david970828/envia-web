import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable()
export class GuidesService {

  constructor(private http: HttpClient) { }

  createGuide(data: any): Observable<any> {
    return this.http.post(`${environment.apiServices}/guides/create`, { data }, { responseType:'text' }).pipe((response: any) => response);
  }

  listGuides(): Observable<any> {
    return this.http.get(`${environment.apiServices}/guides_view`).pipe((response: any) => response);
  }

  getGuide(id: string): Observable<any> {
    return this.http.get(`${environment.apiServices}/guides_view/${id}`).pipe((response: any) => response);
  }

  getPerson(id: string): Observable<any> {
    return this.http.get(`${environment.apiServices}/people/${id}`).pipe((response: any) => response);
  }

  updateGuide(pathParam: string, data: any): Observable<any> {
    return this.http.put(`${environment.apiServices}/pdf-update/${pathParam}`, { data }).pipe((response: any) => response);
  }

}
