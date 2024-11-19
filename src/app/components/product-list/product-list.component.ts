import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    FormsModule, CommonModule, RouterModule
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {

  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchQuery = '';
  pageSize = 5;
  currentPage = 1;

  showModal: boolean = false;
  productToDelete!: Product;

  constructor(private productService: ProductService,
              private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.products = response.data;
        this.filteredProducts = this.products;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
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
  }

  onDelete(product: Product) {
    this.productToDelete = product;
    this.openModal();
  }

  // Función para mostrar el modal
  openModal() {
    this.showModal = true;
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
        const index = this.products.findIndex( product => product == this.productToDelete);
        this.products.splice(index, 1);
        this.productToDelete = null;
      },
      error => {
        // 'No se pudo eliminar el producto. Intente nuevamente.'
        this.showModal = false;
      }
    );
  }

}
