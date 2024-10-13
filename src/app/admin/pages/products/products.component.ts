import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { IProduct } from '../../core/models/product.models';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { PrimeNGConfig } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { CategoryService } from '../../core/services/category.service';
import { ICategory } from '../../core/models/category.models';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    RippleModule,
    PaginatorModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    ToolbarModule,
    ToastModule,
    DropdownModule,
  ],
  templateUrl: './products.component.html',
  styles: [
    `
      :host ::ng-deep .p-dialog .product-image {
        width: 200px;
        margin: 0 auto 2rem auto;
        display: block;
      }
    `,
  ],
})
export class ProductsComponent implements OnInit, OnDestroy {
  constructor() {}

  private destroy$ = new Subject();
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  private productService: ProductService = inject(ProductService);
  private categoryService: CategoryService = inject(CategoryService);
  private primengConfig: PrimeNGConfig = inject(PrimeNGConfig);

  protected products: IProduct[] = [];
  protected product: IProduct = new IProduct();
  protected productDialog: boolean = false;

  protected categories: ICategory[] = [];
  protected selectedCategory: ICategory | undefined;

  ngOnInit(): void {
    this.primengConfig.ripple = true;

    this.productService
      .getProducts()
      .pipe(
        takeUntil(this.destroy$),
        map((products) => (this.products = products))
      )
      .subscribe();

    this.categoryService
      .getCategories()
      .pipe(
        takeUntil(this.destroy$),
        map((categories) => (this.categories = categories))
      )
      .subscribe();
  }
  openNew() {
    this.product = new IProduct();
    // this.submitted = false;
    this.productDialog = true;
  }
  deleteProduct(product: IProduct): void {}

  editProduct(product: IProduct): void {
    this.product = { ...product };
    this.selectedCategory = this.categories.find(
      (cat) => cat.id == this.product.category.id
    );

    this.productDialog = true;
  }
}
