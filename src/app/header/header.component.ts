import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isUserAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.isUserAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.isUserAuthenticated = isAuthenticated;
    });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}