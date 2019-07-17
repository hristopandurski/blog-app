import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserAuthData } from '../auth/auth-data.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  isLoading = true;
  form: FormGroup;
  userData: UserAuthData;
  private userId: string;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.form = new FormGroup({
      firstName: new FormControl(null, {
        validators: [Validators.required]
      }),
      lastName: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.userId = this.authService.getUserId();
    this.authService.getUserInfo(this.userId)
      .subscribe((user: UserAuthData) => {
        this.userData = user;
        this.form.setValue({
          firstName: user.firstName,
          lastName: user.lastName
        });
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
      });
  }

  onUpdate() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.updateUser(
      this.userId,
      this.form.value.firstName,
      this.form.value.lastName
    );
  }
}
