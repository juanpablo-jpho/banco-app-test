import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { environment } from '../environments';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
    
    private baseUrl = `${environment.backend}/bp/products`;

    constructor(private http: HttpClient) {}

    getProducts(): Observable<{ data: Product[] }> {
        return this.http.get<{ data: Product[] }>(this.baseUrl).pipe(
            catchError(this.handleError)
            );
    }

    // Método para crear un producto
    createProduct(product: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<any>(this.baseUrl, product, { headers }).pipe(
            catchError(this.handleError)
            );
    }

    checkIdExists(id: string): Observable<boolean> {
        const url = `${this.baseUrl}/verification/${id}`;
        return this.http.get<boolean>(url).pipe(
            catchError(this.handleError)
            );
    }

    getProductById(id: string): Observable<any> {
        const url = `${this.baseUrl}/${id}`;
        return this.http.get<any>(url).pipe(
            catchError(this.handleError)
            );
    }
  
    updateProduct(id: string, productData: any): Observable<any> {
        const url = `${this.baseUrl}/${id}`;
        return this.http.put<any>(url, productData).pipe(
            catchError(this.handleError)
            );
    }

    // Método para eliminar un producto
    deleteProduct(productId: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${productId}`).pipe(
            catchError(this.handleError)
            );
    }

    private handleError(error: HttpErrorResponse) {
        console.error('API Error:', error);
        return throwError(() => new Error('Error fetching products. Try again later.'));
    }
}


