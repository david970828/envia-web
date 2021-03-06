import { Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GuidesService } from '../../services/guides-service';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {RoleEnum} from "../../enums/role-enum";

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
    this.stepGuide = 0;
    this.isStatusGuide = false;

    this.formLogin = new FormGroup({
        user: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.minLength(6), Validators.required]),
      },
    );
    this.formTrack = new FormGroup({
        id: new FormControl('', [Validators.required])
      },
    );
  }

  ngOnInit(): void {}

  login() {
    const auth = getAuth();
    const obj = this.formLogin.value;
    signInWithEmailAndPassword(auth, obj.user, btoa(obj.password)).then(async (userCredential) => {
      const docRef = await doc(getFirestore(), `users/${userCredential.user.uid}`);
      const roleUser = await getDoc(docRef);
      if (roleUser.data()) {
        // @ts-ignore
        const role = roleUser.data().role;
        if (role === RoleEnum.ADMIN || role === RoleEnum.POINT) {
          sessionStorage.setItem('role', role);
          // @ts-ignore
          sessionStorage.setItem('tk', userCredential.user.accessToken);
          this.router.navigate(['home']);
        } else {
          this.toastService.error(this.translateService.instant('ERRORS.USER_PERMISSION'), this.translateService.instant('ERRORS.TITLE'));
        }
      } else {
        this.toastService.error(this.translateService.instant('ERRORS.USER_UNDEFINED'), this.translateService.instant('ERRORS.TITLE'));
      }
    }).catch(() => {
      this.toastService.error(this.translateService.instant('ERRORS.USER_PASSWORD'), this.translateService.instant('ERRORS.TITLE'));
    })
  }

  trackGuide() {
    this.guidesService.getGuide(this.formTrack.controls.id.value).subscribe(response => {
      if (response !== null) {
        this.stepGuide = response.status_guide;
        this.isStatusGuide = true;
        setTimeout(() => {
          this.isStatusGuide = false;
          this.formTrack.controls.id.setValue('');
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
