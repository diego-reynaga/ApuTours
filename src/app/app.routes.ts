import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Destinos } from './pages/destinos/destinos';
import { Gastronomia } from './pages/gastronomia/gastronomia';
import { Transporte } from './pages/transporte/transporte';
import { Hospedaje } from './pages/hospedaje/hospedaje';
import { Reservas } from './pages/reservas/reservas';
import { Contacto } from './pages/contacto/contacto';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'destinos', component: Destinos },
  { path: 'gastronomia', component: Gastronomia },
  { path: 'transporte', component: Transporte },
  { path: 'hospedaje', component: Hospedaje },
  { path: 'reservas', component: Reservas },
  { path: 'contacto', component: Contacto },
  { path: '**', redirectTo: '' }
];
