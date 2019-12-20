import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService as InternalAuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { AuthService, FacebookLoginProvider } from 'angularx-social-login';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  private socialAuthStatusSub: Subscription;

  constructor(
    private internalAuthService: InternalAuthService,
    private socialAuthService: AuthService
  ) { }

  ngOnInit() {
    this.authStatusSub = this.internalAuthService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );

    this.socialAuthStatusSub = this.socialAuthService.authState.subscribe((user) => {
      if (!user) { return; }
      this.internalAuthService.facebookLogin(user.email);
    });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
    this.socialAuthStatusSub.unsubscribe();
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    this.internalAuthService.login(form.value.email, form.value.password);
  }

  signInWithFB(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).catch(err => {});
  }
}
