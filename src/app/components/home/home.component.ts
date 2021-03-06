import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  role: string | null;

  constructor(private router: Router, public authService: AuthService) {
    this.role = sessionStorage.getItem('role');
  }

  ngOnInit(): void {}

  logout(): void {
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('tk');
    this.router.navigate(['login']);
  }

  setLanguage(language: string): void {
    this.authService.setLanguage(language);
  }
}
