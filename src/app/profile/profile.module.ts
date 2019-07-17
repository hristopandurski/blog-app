import { NgModule } from '@angular/core';

import { ProfileComponent } from './profile.component';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileRoutingModule } from './profile-routing.module';

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    ProfileRoutingModule
  ],
  exports: [],
  declarations: [ProfileComponent],
  providers: [],
})
export class ProfileModule { }
