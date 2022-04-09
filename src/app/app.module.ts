import { NgModule } from '@angular/core';
import { AgmCoreModule } from "@agm/core";
import { ToastrModule } from "ngx-toastr";
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "./services/auth-service";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { AppRoutingModule } from './app-routing.module';
import { MatListModule } from "@angular/material/list";
import { UsersService } from "./services/users-service";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { BrowserModule } from '@angular/platform-browser';
import { GuidesService } from "./services/guides-service";
import { environment } from "../environments/environment";
import { RoutesService } from "./services/routes-service";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { CustomValidators } from "./utils/CustomValidators";
import { MatNativeDateModule } from "@angular/material/core";
import { ColombiaService } from "./services/colombia-service";
import { HomeComponent } from './components/home/home.component';
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { LoginComponent } from './components/login/login.component';
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdministratorComponent } from './components/administrator/administrator.component';
import { BranchOfficesComponent } from './components/branch-offices/branch-offices.component';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
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
    HttpClientModule,
    AppRoutingModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
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
    }),
  ],
  providers: [
    AuthService,
    UsersService,
    RoutesService,
    GuidesService,
    ColombiaService,
    CustomValidators
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
