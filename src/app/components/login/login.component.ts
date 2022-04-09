import { Component, OnInit } from '@angular/core';
import { Router} from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { GuidesService } from "../../services/guides-service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hide: boolean;
  stepGuide: number;
  formLogin: FormGroup;
  formTrack: FormGroup;
  isStatusGuide: boolean;

  constructor(private router: Router, private guidesService: GuidesService,
              private toastService: ToastrService, private translateService: TranslateService) {
    this.hide = true;
    this.stepGuide = 7;
    this.isStatusGuide = false;

    this.formLogin = new FormGroup({
        user: new FormControl('', [Validators.required]),
        password: new FormControl('',[Validators.minLength(5), Validators.required]),
      },
    );
    this.formTrack = new FormGroup({
        id: new FormControl('', [Validators.required])
      },
    );
  }

  ngOnInit(): void {}

  login(): void {
    if (this.formLogin.controls.user.value === 'admin') {
      sessionStorage.setItem('role', 'ADMIN')
      this.router.navigate(['home']);
    } else {
      sessionStorage.setItem('role', 'POINT')
      this.router.navigate(['home']);
    }
  }

  trackGuide() {
    this.guidesService.getGuide(this.formTrack.controls.id.value).subscribe(response => {
      if (response !== null) {
        this.stepGuide = response.status_guide;
        this.isStatusGuide = true;
        setTimeout(() => {
          this.isStatusGuide = false;
        }, 30000);
      } else {
        this.toastService.error(this.translateService.instant('ERRORS.TRACK_GUIDE'), this.translateService.instant('ERRORS.TITLE'));
      }
    }, error => {
      this.toastService.error(this.translateService.instant('ERRORS.TRACK_GUIDE'), this.translateService.instant('ERRORS.TITLE'));
    });
  }

  getLabelTracker() {
    return (this.stepGuide < 4) ? 4 : this.stepGuide;
  }
}
