import {Component, OnInit, ViewChild} from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {CustomValidators} from "../../utils/CustomValidators";
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

    this.hide = true;
    this.lat = 0;
    this.lng = 0;
    this.selectedShape = []
    this.listUsers = [
      {id: 1, user: 'da1@da.co'},
      {id: 2, user: 'da2@da.co'}
    ];
    this.displayedColumns = ['id', 'user', 'actions'];
    this.selectedArea = 0;
    this.hideConfirm = true;
  }

  ngOnInit(): void {
    this.setCurrentPosition();
    this.initMap();
  }

  createUser(): void {
  }

  onMapReady(map: any) {
    this.map = map;
    this.initDrawingManager();
  }

  initDrawingManager = () => {
    const options = {
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: ['polygon'],
      },
      polygonOptions: {
        draggable: true,
        editable: true,
      },
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
    };
    this.drawingManager = new google.maps.drawing.DrawingManager(options);
    this.drawingManager.setMap(this.map);
    google.maps.event.addListener(
      this.drawingManager,
      'overlaycomplete',
      (event: any) => {
        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
          const paths = event.overlay.getPaths();
          for (let p = 0; p < paths.getLength(); p++) {
            google.maps.event.addListener(
              paths.getAt(p),
              'set_at',
              () => {
                event.fillColor = 'red';
                if (!event.overlay.drag) {
                  this.selectedArea = google.maps.geometry.spherical.computeArea(
                    event.overlay.getPath(),
                    event.fillColor = 'red'
                  );
                }
              }
            );
            google.maps.event.addListener(
              paths.getAt(p),
              'insert_at',
              () => {
                event.fillColor = 'red';
                this.selectedArea = google.maps.geometry.spherical.computeArea(
                  event.overlay.getPath(),
                  event.fillColor = 'red'
                );
              }
            );
            google.maps.event.addListener(
              paths.getAt(p),
              'remove_at',
              () => {
                event.fillColor = 'red';
                this.selectedArea = google.maps.geometry.spherical.computeArea(
                  event.overlay.getPath(),
                  event.fillColor = 'red'
                );
              }
            );
          }
          let polygon: any;
          polygon = event.overlay;
          polygon.type = event.type;
          polygon.se
          polygon.positions = this.getPointList(event.overlay.getPath());
          polygon.id = Math.floor(Math.random() * (1000 - 10));
          this.selectedShape.push(polygon);
          this.formPolygons.addControl('name' + polygon.id, new FormControl('', [Validators.required]));
          this.formPolygons.addControl('description' + polygon.id, new FormControl('', [Validators.required]));
          this.formPolygons.addControl('positions' + polygon.id, new FormControl(polygon.positions, [Validators.required]));
        }

      }
    );
  }
  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });
    }
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

  savePolygon() {
    let listPolygons: {}[] = [];
    this.selectedShape.forEach(item => {
      let polygon = {
        name: this.formPolygons.controls['name' + item.id].value,
        description: this.formPolygons.controls['description' + item.id].value,
        positions: this.formPolygons.controls['positions' + item.id].value.map((item: { lat: any; lng: any; }) => {
          return {latitude: item.lat, longitude: item.lng}
        })
      };
      listPolygons.push(polygon);
    });
    console.log(listPolygons);
  }

  initMap() {
    let positionsByRute = [{}];
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 4.683187, lng: -74.047565 },
      zoom: 13
    });

    var fill_color = "rgb(155, 102, 102)";

    var poligono = new google.maps.Polygon({
      path: positionsByRute,
      map: this.map,
      strokeColor: fill_color,
      fillColor: fill_color,
      strokeWeight: 3,
    });
/*
    var popup = new google.maps.InfoWindow();
    poligono.addListener('click', function(e) {
      popup.setContent('Cobertura para poligono XXX');
      popup.setPosition(e.latLng);
      popup.open(this.map);
    });
*/
  }
}
