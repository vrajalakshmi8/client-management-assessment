import { Routes } from '@angular/router';
import { ClientListComponent } from './components/client-list/client-list.component';
import { ClientFormComponent } from './components/client-form/client-form.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/clients',
    pathMatch: 'full'
  },
  {
    path: 'clients',
    children: [
      {
        path: '',
        component: ClientListComponent,
        title: 'Client List'
      },
      {
        path: 'new',
        component: ClientFormComponent,
        title: 'Add New Client'
      },
      {
        path: ':id/edit',
        component: ClientFormComponent,
        title: 'Edit Client'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/clients'
  }
];

