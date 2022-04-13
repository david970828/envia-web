import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class VehiclesService {

  constructor(private http: HttpClient) { }

  listVehicles(): Observable<any> {
    return this.http.get(`${environment.apiVehicles}/api/vehicles`).pipe((response: any) => response);
  }

  createVehicle(vehicle: any): Observable<any> {
    return this.http.post(`${environment.apiVehicles}/api/vehicles`, vehicle).pipe((response: any) => response);
  }

  updateVehicle(vehicle: any): Observable<any> {
    return this.http.patch(`${environment.apiVehicles}/api/vehicles/SetVehicleRoute`, vehicle).pipe((response: any) => response);
  }
}
