import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ICategory } from '../models/category.models';
import { Observable } from 'rxjs';
import { apiEndpoint } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http: HttpClient = inject(HttpClient);

  constructor() {}

  getCategories(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(apiEndpoint.CATEGORIES.LIST);
  }
}
