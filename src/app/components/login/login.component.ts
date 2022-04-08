import { Component, OnInit } from '@angular/core';
import { Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CustomValidators} from "../../utils/CustomValidators";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hide: boolean;
  formLogin: FormGroup;

  constructor(private router: Router) {
    this.hide = true;
    this.formLogin = new FormGroup({
        user: new FormControl('', [Validators.required]),
        password: new FormControl('',[Validators.minLength(5), Validators.required]),
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

}
