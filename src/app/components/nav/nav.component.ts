import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';

import { StoreService } from '../../services/store.service';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';

import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  activeMenu = false;
  counter = 0;
  token = '';
  profile: User | null = null;

  constructor(
    private storeService: StoreService,
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.storeService.myCart$.subscribe((products) => {
      this.counter = products.length;
    });
  }

  toggleMenu() {
    this.activeMenu = !this.activeMenu;
  }

  login() {
    this.authService.login('vicente@gmail.com', '123123').subscribe((rta) => {
      this.token = rta.access_token;
      console.log(rta.access_token);
      this.getProfile();
    });
  }

  loginProfile() {
    this.authService
      .login('vicente@gmail.com', '123123')
      .pipe(
        switchMap((rta) => {
          this.token = rta.access_token;
          return this.authService.profile(this.token);
        })
      )
      .subscribe((data) => {
        this.profile = data;
      });
  }

  getProfile() {
    this.authService.profile(this.token).subscribe((user) => {
      this.profile = user;
    });
  }
}
