import { inject, Injectable } from '@angular/core';
import { apiEndpoint } from '../constants';
import { map, Observable } from 'rxjs';
import { IProduct } from '../models/product.models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http: HttpClient = inject(HttpClient);

  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(apiEndpoint.PRODUCTS.LIST).pipe(
      map((response: any) => this.formatImageJson(response))
    );;
  }

  createProduct(product: IProduct): Observable<IProduct> {
    return this.http.post<IProduct>(apiEndpoint.PRODUCTS.CREATE, product);
  }

  updateProduct(id: number, product: IProduct): Observable<IProduct> {
    return this.http.put<IProduct>(
      `${apiEndpoint.PRODUCTS.UPDATE}/${id}`,
      product
    );
  }

  deleteProduct(id: number) {
    return this.http.delete(`${apiEndpoint.PRODUCTS.DELETE}/${id}`);
  }

  filesUpload(image: FormData): Observable<any> {
    console.log('image', image);

    return this.http.post<any>(`${apiEndpoint.FILES.UPLOAD}`, image);
  }

  private formatImageJson(data: any): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.formatImageJson(item));
    } else if (data && typeof data === 'object' && data.images) {
      if (Array.isArray(data.images) && typeof data.images[0] === 'string') {
        // Check if the first element is a stringified array
        if (
          data.images[0].startsWith('[') &&
          data.images[data.images.length - 1].endsWith(']')
        ) {
          try {
            // Join the array elements and parse as JSON
            const joinedString = data.images.join(',');
            data.images = JSON.parse(joinedString);
          } catch (error) {
            console.warn(
              `Warning: Could not parse images JSON. Using original array. Error: ${error}`
            );
          }
        }
        // Remove any remaining quotes from individual URLs
        data.images = data.images.map((url: string) =>
          url.replace(/^"|"$/g, '')
        );
      }
    }
    return data;
  }
}
