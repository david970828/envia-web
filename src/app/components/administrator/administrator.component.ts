import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { CustomValidators } from '../../utils/CustomValidators';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginator } from '@angular/material/paginator';
import { RoutesService} from '../../services/routes-service';
import { createUserWithEmailAndPassword, getAuth, deleteUser, User } from 'firebase/auth';
import { doc, getFirestore, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { MatTableDataSource } from "@angular/material/table";
import {RoleEnum} from "../../enums/role-enum";
declare const google: any;

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.css']
})
export class AdministratorComponent implements OnInit {

  map: any;
  lat: number;
  lng: number;
  hide: boolean;
  isEdit: boolean;
  roleList: string[];
  listPolygons: any[];
  selectedShape: any[];
  drawingManager: any;
  selectedArea: number;
  hideConfirm: boolean;
  formUsers: FormGroup;
  formPolygons: FormGroup;
  displayedColumns: string[];
  displayedColumnsPolygons: string[];
  isCreatingPolygon: boolean;
  listUsers: MatTableDataSource<any>;
  @ViewChild(MatPaginator)
  paginator: MatPaginator | undefined;
  @ViewChild(FormGroupDirective)
  formDirective: FormGroupDirective | undefined;

  constructor(private toastService: ToastrService, private translateService: TranslateService,
              private routesService: RoutesService) {

    this.formUsers = new FormGroup({
      user: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('',[Validators.minLength(6), Validators.required]),
      confirmPassword: new FormControl('', [Validators.minLength(6), Validators.required]),
      role: new FormControl('ADMIN', Validators.required),
    }, {
      validators: [CustomValidators.match('password', 'confirmPassword')]
      }
    );

    this.formPolygons = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      positions: new FormControl('', [Validators.required]),
      color: new FormControl('', [Validators.required]),
    });

    this.lat = 0;
    this.lng = 0;
    this.hide = true;
    this.isEdit = false;
    this.selectedArea = 0;
    this.hideConfirm = true;
    this.selectedShape = [];
    this.isCreatingPolygon = false;
    this.roleList = Object.values(RoleEnum);
    this.listUsers = new MatTableDataSource<any>();
    this.displayedColumns = ['id', 'user', 'role', 'actions'];
    this.displayedColumnsPolygons = ['color', 'name', 'description', 'actions'];
    this.listPolygons = [];
  }

  ngOnInit(): void {
    this.setCurrentPosition();
    this.usersList();
  }

  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });
    }
  }

  onMapReady(map: any) {
    this.map = map;
    this.listRoutes();
  }

  initDrawingManager() {
    let color = this.rgbColor();
    const options = {
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: [google.maps.drawing.OverlayType.POLYGON],
      },
      polygonOptions: {
        draggable: true,
        editable: true,
        strokeColor: color,
        fillColor: color,
        strokeWeight: 3,
      },
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
    };
    this.drawingManager = new google.maps.drawing.DrawingManager(options);
    this.drawingManager.setMap(this.map);
    this.isCreatingPolygon = true;
    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (event: any) => {
        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
          const paths = event.overlay.getPaths();
          for (let p = 0; p < paths.getLength(); p++) {
            google.maps.event.addListener(paths.getAt(p), 'set_at', () => {
              if (!event.overlay.drag) {
                this.selectedArea = google.maps.geometry.spherical.computeArea(
                  event.overlay.getPath()
                );
              }
            });
            google.maps.event.addListener(paths.getAt(p), 'insert_at', () => {
              this.selectedArea = google.maps.geometry.spherical.computeArea(
                event.overlay.getPath()
              );
            });
            google.maps.event.addListener(paths.getAt(p), 'remove_at', () => {
              this.selectedArea = google.maps.geometry.spherical.computeArea(
                event.overlay.getPath()
              );
            });
          }

          this.newPolygon(event, color);
          if (event.type !== google.maps.drawing.OverlayType.MARKER) {
            this.drawingManager.setDrawingMode(null);
            this.drawingManager.setOptions({
              drawingControl: false,
            });
          }
        }
      }
    );
  }

  newPolygon(event: any, color: string) {
    let polygon: any;
    polygon = event.overlay;
    polygon.color = color;
    polygon.type = event.type;
    polygon.id = Math.floor(Math.random() * (1000 - 10));
    polygon.positions = this.getPointList(event.overlay.getPath());

    this.selectedShape.push(polygon);
    this.formPolygons.controls.name.setValue('');
    this.formPolygons.controls.description.setValue('');
    this.formPolygons.controls.positions.setValue(polygon.positions);
    this.formPolygons.controls.color.setValue(polygon.color);
  }

  getPointList(path: any) {
    let pointList = [];
    const len = path.getLength();
    for (let i = 0; i < len; i++) {
      pointList.push(
        path.getAt(i).toJSON()
      );
    }
    return pointList;
  }

  uploadPolygons(list: any[]) {
    let listTemp: any[] = [];
    list.forEach(obj => {
      let positions = obj.positions.map((item: { latitude: any; longitude: any; }) => {
        return { lat: item.latitude, lng: item.longitude }
      });

      const fill_color = this.rgbColor();
      let polygon = new google.maps.Polygon({
        path: positions,
        map: this.map,
        strokeColor: fill_color,
        fillColor: fill_color,
        strokeWeight: 3,
        id: obj.id,
        positions: obj.positions,
        color: fill_color
      });

      let map = this.map;
      let popup = new google.maps.InfoWindow();
      polygon.addListener('click', function(e: any) {
        popup.setContent('Ruta: ' + obj.name);
        popup.setPosition(e.latLng);
        popup.open(map);
      });
      listTemp.push({...obj, color: polygon.color});
      this.selectedShape.push(polygon);
    });
    this.listPolygons = listTemp;
  }

  savePolygon() {
    let polygon = {
      name: this.formPolygons.controls.name.value,
      description: this.formPolygons.controls.description.value,
      positions: this.formPolygons.controls.positions.value.map((item: { lat: any; lng: any; }) => {
        return {latitude: item.lat, longitude: item.lng};
      })
    };

    this.routesService.createRoute(polygon).subscribe(() => {
      this.listPolygons = [];
      this.selectedShape = [];
      this.listRoutes();
      this.isCreatingPolygon = false;
      this.toastService.success(this.translateService.instant('LABELS.SUCCESS_ROUTES'), this.translateService.instant('LABELS.NEW_ROUTE'));
    }, (error) => {
      this.toastService.error(this.translateService.instant('ERRORS.ROUTES'), this.translateService.instant('ERRORS.TITLE'));
    });
  }

  deletePolygon(id: number) {
    this.routesService.deleteRoute(id).subscribe(() => {
      if (this.selectedShape.length > 0) {
        this.selectedShape.map(item => {
          if (item.id === id) {
            item.setMap(null);
            this.selectedArea = 0;
          }
        });
        this.selectedShape = this.selectedShape.filter(item => { return item.id !== id });
        this.listRoutes();
        this.toastService.success(this.translateService.instant('LABELS.DELETE_ROUTE'), this.translateService.instant('LABELS.ROUTES_MANAGEMENT'));
      }
    }, (error) => {
      this.toastService.error(this.translateService.instant('ERRORS.ROUTES_DELETE'), this.translateService.instant('ERRORS.TITLE'));
    });
  }

  createUser() {
    if (this.isEdit) {
      this.isEdit = false;
    } else {
      const auth = getAuth();
      let obj = this.formUsers.value;
      createUserWithEmailAndPassword(auth, obj.user, btoa(obj.password))
        .then(async (userCredential) => {
          const docRef = await doc(getFirestore(), `users/${userCredential.user.uid}`);
          setDoc(docRef, {user: obj.user, role: obj.role, uid: userCredential.user.uid}).then((response) => {
            //@ts-ignore
            this.formDirective.resetForm();
            this.formUsers.reset();
            this.usersList();
            this.toastService.success(this.translateService.instant('LABELS.SUCCESS_USER'), this.translateService.instant('LABELS.SUCCESS_USER_TITLE'));
          }).catch((error) => {
            this.viewError();
          });
        }).catch((error) => {
        this.viewError();
      });
    }
  }

  viewError() {
    this.toastService.error(this.translateService.instant('ERRORS.USER'), this.translateService.instant('ERRORS.TITLE'));
  }

  deleteUser(user: any) {
    deleteDoc(doc(getFirestore(), 'users', user.uid)).then(() => {
      this.toastService.success(this.translateService.instant('LABELS.USER_DELETE'), this.translateService.instant('LABELS.USER_DELETE_TITLE'));
      this.usersList();
    }).catch(() => {
      this.toastService.error(this.translateService.instant('ERRORS.USER_DELETE'), this.translateService.instant('ERRORS.TITLE'));
    });
  }

  async usersList() {
    const docs = await getDocs(collection(getFirestore(), 'users/'));
    const users: any[] | undefined = [];
    docs.forEach(doc => {
      users.push(doc.data());
    });
    this.listUsers =  new MatTableDataSource(users);
    //@ts-ignore
    this.listUsers.paginator = this.paginator;
  }

  listRoutes() {
    this.routesService.listRoutes().subscribe(response => {
      this.uploadPolygons(response);
    }, (error) => {
      this.toastService.error(this.translateService.instant('ERRORS.ROUTES_LIST'), this.translateService.instant('ERRORS.TITLE'));
    })
  }

  rgbColor(): string {
    return `rgb(${this.getNumber(255)},${this.getNumber(255)},${this.getNumber(255)})`;
  }

  getNumber(number: number) {
    return (Math.random() * number).toFixed(0);
  }
}
