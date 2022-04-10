import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable()
export class RoutesService {

  constructor(private http: HttpClient) { }

  listRoutes(): Observable<any> {
    return this.http.get(`${environment.apiPolygons}/api/polygon`).pipe((response: any) => response);
  }

  createRoute(route: any): Observable<any> {
    return this.http.post(`${environment.apiPolygons}/api/polygon`, route).pipe((response: any) => response);
  }

  deleteRoute(id: number): Observable<any> {
    return this.http.delete(`${environment.apiPolygons}/api/polygon/${id}`).pipe((response: any) => response);
  }
}
