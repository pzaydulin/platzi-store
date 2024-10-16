import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { IProduct } from '../../core/models/product.models';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { MessageService, PrimeNGConfig } from 'primeng/api';
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
import { CarouselModule } from 'primeng/carousel';
import { FileSelectEvent, FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    TableModule,
    ButtonModule,
    RippleModule,
    PaginatorModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    ToolbarModule,
    DropdownModule,
    CarouselModule,
    FileUploadModule,
    PanelModule
  ],
  templateUrl: './products.component.html',
  styleUrl:  './products.component.scss',
  providers: [MessageService],
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
  private messageService: MessageService = inject(MessageService);

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

  uploadedFiles: any[] = [];

  onSelect(event: FileSelectEvent) {
    // for (let file of event.files) {
    //   this.uploadedFiles.push(file);
    // }

    this.uploadedFiles = event.currentFiles;

    this.messageService.add({
      severity: 'info',
      summary: 'File Selected',
      detail: '',
    });
    console.log(event);
  }

  chooseFiles(event: any, callback: any) {
    callback();
  }

  clearFiles(callback: any) {
    this.uploadedFiles = [];
    callback();
  }
}
