import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomValidators } from "../../utils/CustomValidators";
declare const google: any;

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.css']
})
export class AdministratorComponent implements OnInit {

  lat: number;
  lng: number;
  hide: boolean;
  map: any;
  listUsers: any[];
  selectedShape: any[];
  drawingManager: any;
  selectedArea: number;
  hideConfirm: boolean;
  formUsers: FormGroup;
  formPolygons: FormGroup;
  displayedColumns: string[]
  paths: any;
  listPolygons: any[];

  constructor() {
    this.formUsers = new FormGroup({
      user: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('',[Validators.minLength(5), Validators.required]),
      confirmPassword: new FormControl('', [Validators.minLength(5), Validators.required]),
      role: new FormControl('ADMIN', Validators.required),
    }, {
      validators: [CustomValidators.match('password', 'confirmPassword')]
      }
    );

    this.formPolygons = new FormGroup({});
    this.displayedColumns = ['id', 'user', 'actions'];
    this.hide = true;
    this.lat = 0;
    this.lng = 0;
    this.selectedShape = [];
    this.selectedArea = 0;
    this.hideConfirm = true;
    this.listPolygons = JSON.parse(<string>sessionStorage.getItem('routes'));
    this.listUsers = [
      {id: 1, user: 'da1@da.co'},
      {id: 2, user: 'da2@da.co'}
    ];
  }

  ngOnInit(): void {
    this.setCurrentPosition();
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
    this.listPolygons.forEach((plg, index) => {
      this.uploadPolygons(this.listPolygons[index]);
    });
    this.initDrawingManager();
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

          this.newPolygon(event);
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

  newPolygon(event: any) {
    let polygon: any;
    polygon = event.overlay;
    polygon.type = event.type;
    polygon.id = Math.floor(Math.random() * (1000 - 10));
    polygon.positions = this.getPointList(event.overlay.getPath());

    this.selectedShape.push(polygon);
    this.formPolygons.addControl('name' + polygon.id, new FormControl('', [Validators.required]));
    this.formPolygons.addControl('description' + polygon.id, new FormControl('', [Validators.required]));
    this.formPolygons.addControl('positions' + polygon.id, new FormControl(polygon.positions, [Validators.required]));
  }

  deletePolygon(id: number) {
    if (this.selectedShape.length > 0) {
      this.selectedShape.map(item => {
        if (item.id === id) {
          item.setMap(null);
          this.selectedArea = 0;
          this.drawingManager.setOptions({
            drawingControl: true,
          });
        }
      });
      this.formPolygons.removeControl('name' + id);
      this.formPolygons.removeControl('description' + id);
      this.formPolygons.removeControl('positions' + id);
      this.selectedShape= this.selectedShape.filter(item=> {return item.id !== id});
    }
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

  uploadPolygons(obj: any) {
    //@ts-ignore
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
      positions: obj.positions
    });

    let map = this.map;
    let popup = new google.maps.InfoWindow();
    polygon.addListener('click', function(e: any) {
      popup.setContent('Ruta: ' + obj.name);
      popup.setPosition(e.latLng);
      popup.open(map);
    });

    this.selectedShape.push(polygon);
    this.formPolygons.addControl('name' + obj.id, new FormControl(obj.name, [Validators.required]));
    this.formPolygons.addControl('description' + obj.id, new FormControl(obj.description, [Validators.required]));
    this.formPolygons.addControl('positions' + obj.id, new FormControl(positions, [Validators.required]));
  }

  savePolygon() {
    let listPolygons: {}[] = [];
    this.selectedShape.forEach(item => {
      let polygon = {
        id: item.id,
        name: this.formPolygons.controls['name' + item.id].value,
        description: this.formPolygons.controls['description' + item.id].value,
        positions: this.formPolygons.controls['positions' + item.id].value.map((item: { lat: any; lng: any; }) => {
          return {latitude: item.lat, longitude: item.lng}
        })
      };
      listPolygons.push(polygon);
    });
    sessionStorage.setItem('routes', JSON.stringify(listPolygons));
  }

  createUser() {}

  rgbColor(): string {
    return "rgb(" + this.getNumber(255) +"," + this.getNumber(255) + "," + this.getNumber(255) +")";
  }

  getNumber(number: number) {
    return (Math.random() * number).toFixed(0);
  }
}
