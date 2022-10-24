import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';

import { StoreService } from './../../../services/store.service';
import { AuthService } from './../../../services/auth.service';
import { UsersService } from './../../../services/users.service';
import { CategoriesService } from 'src/app/services/categories.service';

import { User } from 'src/app/models/user.model';
import { Category } from 'src/app/models/category.model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  activeMenu = false;
  counter = 0;
  // Profile: User | null = this.authService.user$;
  profile: User | null = null;
  categories: Category[] = [];

  constructor(
    private storeService: StoreService,
    private authService: AuthService,
    private usersService: UsersService,
    private categoriesService: CategoriesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.storeService.myCart$.subscribe((products) => {
      this.counter = products.length;
    });
    this.authService.user$.subscribe((user) => {
      this.profile = user;
    });
    this.getAllCategories();
    this.authService.user$.subscribe((data) => (this.profile = data));
  }

  toggleMenu() {
    this.activeMenu = !this.activeMenu;
  }

  login() {
    this.authService
      .loginAndGet('vicente@gmail.com', '123123')
      // .loginAndGet('john@mail.com', 'changeme')
      .subscribe(() => {
        this.router.navigate(['/profile']);
      });
  }

  getAllCategories() {
    this.categoriesService.getAll().subscribe((data) => {
      this.categories = data;
    });
  }

  logout() {
    this.authService.logout();
    this.profile = null;
    this.router.navigate(['/home']);
  }
}
