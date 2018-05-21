import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthGuardService} from './services/auth-guard.service';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './views/main/main.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class AppRoutingModule {
 }
