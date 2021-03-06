import { NgModule } from '@angular/core';
import { AgmCoreModule } from "@agm/core";
import { ToastrModule } from "ngx-toastr";
import { initializeApp } from 'firebase/app';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "./services/auth-service";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { MatListModule } from "@angular/material/list";
import { AppRoutingModule } from './app-routing.module';
import { MatInputModule } from "@angular/material/input";
import { AngularFireModule } from "@angular/fire/compat";
import { MatTableModule } from "@angular/material/table";
import { BrowserModule } from '@angular/platform-browser';
import { GuidesService } from './services/guides-service';
import { environment } from '../environments/environment';
import { RoutesService } from './services/routes-service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CustomValidators } from './utils/CustomValidators';
import { MatDividerModule } from '@angular/material/divider';
import { MatNativeDateModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { AuthInterceptor } from './services/auth-Interceptor';
import { ColombiaService } from './services/colombia-service';
import { VehiclesService } from './services/vehicles-service';
import { HomeComponent } from './components/home/home.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DialogComponent } from './utils/dialog/dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { LoginComponent } from './components/login/login.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { AdministratorComponent } from './components/administrator/administrator.component';
import { BranchOfficesComponent } from './components/branch-offices/branch-offices.component';

initializeApp(environment.firebaseConfig);

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DialogComponent,
    AdministratorComponent,
    BranchOfficesComponent,
  ],
  imports: [
    BrowserModule,
    MatTabsModule,
    MatMenuModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    MatDividerModule,
    MatStepperModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule,
    MatPaginatorModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    AgmCoreModule.forRoot({
      apiKey: environment.apiKeyMaps,
      libraries: ['places', 'drawing', 'geometry']
    }),
    ToastrModule.forRoot({
      maxOpened: 5,
      autoDismiss: true,
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-top-right',
      timeOut: 10000,
      extendedTimeOut: 5000,
    })
  ],
  providers: [
    AuthService,
    RoutesService,
    GuidesService,
    VehiclesService,
    ColombiaService,
    CustomValidators,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
