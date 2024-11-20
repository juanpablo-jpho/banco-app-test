import { TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let productServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    productServiceMock = {
      getProducts: jest.fn(),
      deleteProduct: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [
      ],
      providers: [
        ProductListComponent,
        { provide: ProductService, useValue: productServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    component = TestBed.inject(ProductListComponent);
  });

  it('should call fetchProducts on init', () => {
    jest.spyOn(component, 'fetchProducts');
    component.ngOnInit();
    expect(component.fetchProducts).toHaveBeenCalled();
  });

  it('should fetch products and set them correctly', () => {
    const mockProducts = [{ id: '1', name: 'Product 1' }] as any[];
    productServiceMock.getProducts.mockReturnValue(of({ data: mockProducts }));

    component.fetchProducts();

    expect(productServiceMock.getProducts).toHaveBeenCalled();
    expect(component.products).toEqual(mockProducts);
    expect(component.filteredProducts).toEqual(mockProducts);
  });

  it('should filter products based on search query', () => {
    component.products = [
      { name: 'Product A' } as any,
      { name: 'Product B' } as any,
    ];
    component.onSearch('A');
    expect(component.filteredProducts).toEqual([{ name: 'Product A' } as any]);
  });

  it('should update page size and reset current page', () => {
    component.currentPage = 2;
    component.onPageSizeChange(10);
    expect(component.pageSize).toBe(10);
    expect(component.currentPage).toBe(1);
  });

  it('should navigate to edit page', () => {
    component.editProduct('123');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/product/edit', '123']);
  });


  it('should call deleteProduct and remove product from list', () => {
    const mockProducts = [{ id: '1' } as any, { id: '2' } as any];
    component.products = mockProducts;
    component.productToDelete = mockProducts[0];
    productServiceMock.deleteProduct.mockReturnValue(of({}));

    component.deleteProduct('1');

    expect(productServiceMock.deleteProduct).toHaveBeenCalledWith('1');
    expect(component.products).toEqual([{ id: '2' } as any]);
    expect(component.showModal).toBeFalsy();
  });
});