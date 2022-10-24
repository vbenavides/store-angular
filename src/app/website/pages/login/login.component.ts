import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';

interface LoginFormModel {
  email: string;
  pass: string;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  profile: User | null = null;
  loginFormModel: LoginFormModel = {
    email: '',
    pass: '',
  };
  emailForm = '';
  passwordForm = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => (this.profile = user));
  }
  onSubmit(loginForm: NgForm) {
    console.log(loginForm);
  }

  login() {
    // .loginAndGet('john@mail.com', 'changeme')

    this.authService
      .loginAndGet(this.emailForm, this.passwordForm)
      // .loginAndGet('vicente@gmail.com', '123123')
      .subscribe(() => {
        this.router.navigate(['/profile']);
      });

    console.log(this.profile);
  }
}
