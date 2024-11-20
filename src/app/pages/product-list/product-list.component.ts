import { Component, HostListener } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Alert, Product } from '../../models/product.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AlertComponent } from '../../components/alert/alert.component';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    FormsModule, CommonModule, RouterModule,
    AlertComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {

  products: Product[] = null;
  filteredProducts: Product[] = [];
  searchQuery = '';
  pageSize = 5;
  currentPage = 1;
  showModal: boolean = false;
  productToDelete!: Product;

  dropdownOpen = false;
  alert: Alert;

  constructor(private productService: ProductService,
              private router: Router
  ) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      // simulación de efecto de retardo de la respuesta del backend para mostrar el skeleton
      this.fetchProducts();
    }, 1500);
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.products = response.data;
        this.filteredProducts = this.products;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.alert = {
          show: true,
          title: 'Error',
          description: 'Error fetching products'
        }
      },
    });
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.filteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1; // Reset to first page
  }

  get paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredProducts.slice(start, end);
  }

  editProduct(productId: string) {
    this.router.navigate(['/product/edit', productId]);
    this.dropdownOpen = false; // Cierra el dropdown
  }

  onDelete(product: Product) {
    this.productToDelete = product;
    // abre el alert para preguntar si está seguro de eliminar el producto
    this.openModal();
    this.dropdownOpen = false; // Cierra el dropdown
  }

  // Función para mostrar el modal
  openModal() {
    this.showModal = true;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.dropdownOpen = false; // Cierra el dropdown si se hace clic fuera
    }
  }

  actionAlert(ev: 'ok' | 'cancel') {
    if (ev == 'ok') {
      this.deleteProduct(this.productToDelete.id)
    }
    if (ev == 'cancel') {
      this.closeModal();
    }
  }
  
  // Función para cerrar el modal
  closeModal() {
    this.showModal = false;
    this.productToDelete = null;
  }

  // Función para eliminar el producto
  deleteProduct(id: string) {
    this.productService.deleteProduct(id).subscribe(
      response => {
        // Producto eliminado exitosamente'
        this.showModal = false;
        // Eliminar producto del variable this.products
        const index = this.products.findIndex( product => product == this.productToDelete);
        this.products.splice(index, 1);
        this.productToDelete = null;
      },
      error => {
        // 'No se pudo eliminar el producto. Intente nuevamente.'
        this.showModal = false;
        this.alert = {
          show: true,
          title: 'Error',
          description: 'No se pudo eliminar el producto. Intente nuevamente.'
        }
      }
    );
  }

}
