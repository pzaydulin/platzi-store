import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { initProduct, IProduct } from '../../core/models/product.models';
import { catchError, delay, forkJoin, map, of, Subject, takeUntil, tap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
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
import { FileRemoveEvent, FileSelectEvent, FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { PanelModule } from 'primeng/panel';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { toObservable } from '@angular/core/rxjs-interop';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

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
    PanelModule,
    ConfirmDialogModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  providers: [MessageService, ConfirmationService],
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
  private confirmationService: ConfirmationService =
    inject(ConfirmationService);

  protected products: IProduct[] = [];
  protected product: IProduct = initProduct;
  protected productDialog: boolean = false;

  protected categories: ICategory[] = [];
  protected selectedCategory: ICategory | undefined;
  protected selectedProducts!: IProduct[];
  protected uploadedFiles: any[] = [];

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

  deleteProduct(id: number): void {
    
    this.confirmationService.confirm({
      header: 'Are you sure?',
      message: 'Please confirm to delete the product.',
      accept: () => {
        this.productService.deleteProduct(id).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product deleted',
          });
          this.products = this.products.filter((p) => p.id !== id);
          this.selectedProducts = this.selectedProducts.filter((p) => p.id !== id)
        });
      },
    });
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      header: 'Are you sure?',
      message: 'Please confirm to delete the selected products.',
      accept: () => {
        this.selectedProducts.forEach((product) => {
          if (product.id) {
            this.productService.deleteProduct(product.id).subscribe();
          }
        });
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Products deleted',
        });
        this.products = this.products.filter(
          (val) => !this.selectedProducts.includes(val)
        );
        this.selectedProducts = [];
      },
    });
  }

  editProduct(product: IProduct): void {
    this.product = { ...product };
    this.selectedCategory = this.categories.find(
      (cat) => cat.id == this.product.category?.id
    );
    this.product.categoryId = this.selectedCategory
      ? this.selectedCategory.id
      : 0;
    this.productDialog = true;
  }

  saveProduct() {
    this.product.category = this.selectedCategory;
    this.product.categoryId = this.selectedCategory?.id;

    const { creationAt, updatedAt, ...productDTO } = this.product;

    let lengthUploadedFiles = this.uploadedFiles.length;

    // Создаем массив наблюдаемых объектов для загрузки файлов
    let uploadObservables = this.uploadedFiles.map((image) => {
      const formData = new FormData();
      formData.set('file', image);
      console.log('formData', formData);

      return this.productService.filesUpload(formData).pipe(
        tap((res) => {
          console.log('file:', res);
          productDTO.images.push(res.location);
          // когда обновляется productDTO Обновляется и this.product
          // this.product.images.push(res.location);
        }),
        catchError((err) => {
          console.log('ОШИБКА file:', err);
          return of(null); // Возвращаем null в случае ошибки, чтобы не прерывать forkJoin
        })
      );
    });

    if (!uploadObservables.length) {
      uploadObservables = [of(null)];
      console.log('uploadObservables', uploadObservables);
    }

    // Используем forkJoin для ожидания завершения всех загрузок
    forkJoin(uploadObservables).subscribe({
      next: (results) => {
        // Фильтруем результаты, чтобы убрать null (ошибки)
        const successfulUploads = results.filter((result) => result !== null);

        if (successfulUploads.length === lengthUploadedFiles) {
          // Если все файлы успешно загружены, выполняем updateProduct

          if (!productDTO.images.length) {
            // picture - 'no image available'
            productDTO.images.push('https://i.imgur.com/jVfoZnP.jpg');
          }

          if (this.product.id) {
            // Update product
            this.productService
              .updateProduct(this.product.id, productDTO)
              .subscribe({
                next: (res) => {
                  this.product = res;
                  console.log('ProductUpdate:', res);
                },
                error: (err) => {
                  console.log('ОШИБКА update:', err, productDTO);
                },
              });

            this.products[
              this.products.findIndex(
                (product) => product.id === this.product.id
              )
            ] = this.product;
            this.products = [...this.products];
            this.productDialog = false;
          } else {
            // Create product
            this.productService.createProduct(productDTO).subscribe({
              next: (res) => {
                this.product = res;
                console.log('ProductCreated:', res);
                this.products.push(this.product);
                this.productDialog = false;
              },
              error: (err) => {
                console.log('ОШИБКА create:', err, productDTO);
              },
            });
          }
        } else {
          console.log('Не все файлы были успешно загружены');
        }
      },
      error: (err) => {
        console.log('ОШИБКА при загрузке файлов:', err);
      },
    });
  }

  openNew() {
    this.product = Object.assign({}, initProduct);
    this.selectedCategory = undefined;
    this.uploadedFiles = [];
    this.productDialog = true;
  }

  hideDialog() {
    this.productDialog = false;
    this.uploadedFiles = [];
  }

  onSelect(event: FileSelectEvent) {
    for (let file of event.files) {
      if (!this.uploadedFiles.find((f) => f.name === file.name)) {
        this.uploadedFiles.push(file);
      }
    }
    this.messageService.add({
      severity: 'info',
      summary: 'Successful',
      detail: 'File Selected',
    });
  }

  onRemove(event: FileRemoveEvent) {
    this.uploadedFiles = this.uploadedFiles.filter(
      (file) => file.name !== event.file.name
    );
  }

  chooseFiles(event: any, callback: any) {
    callback();
  }

  clearFiles(callback: any) {
    this.uploadedFiles = [];
    callback();
  }
  deleteImage(img: any) {
    this.product.images = this.product.images.filter((i) => i !== img);
  }

  // WARNING: sanitizing unsafe URL value ..
  // GET unsafe:[""] net::ERR_UNKNOWN_URL_SCHEME

  private sanitizer: DomSanitizer = inject(DomSanitizer);
  sanitizeImageUrl(imageUrl: any) {
    return imageUrl;

    let url = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    // console.log('url:', url, imageUrl);

    return url;
  }
}
