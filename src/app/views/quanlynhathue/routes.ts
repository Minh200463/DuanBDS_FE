import { Routes } from '@angular/router';

import { QuanlynhathueComponent } from './quanlynhathue.component';

export const routes: Routes = [
  {
    path: '',
    component: QuanlynhathueComponent, 
    data: {
      title: 'House Rental Manager'
    },
  }
];
