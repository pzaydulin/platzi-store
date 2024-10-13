import { inject, Injectable } from '@angular/core';
import { apiEndpoint } from '../constants';
import { Observable } from 'rxjs';
import { IProduct } from '../models/product.models'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private http: HttpClient = inject(HttpClient);

  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(
      apiEndpoint.PRODUCTS.LIST
    );
  }
}
