import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'products',
        loadComponent: () => import('./pages/product-list/product-list.component').then( m => m.ProductListComponent)
    },
    {
        path: 'product/create',
        loadComponent: () => import('./pages/product-form/product-form.component').then( m => m.ProductFormComponent)
    },
    {
        path: 'product/edit/:id',
        loadComponent: () => import('./pages/product-form/product-form.component').then( m => m.ProductFormComponent)
    },
    {
        path: '**',
        redirectTo: 'products'
    }
];
