import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ProductFormComponent } from './product-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductService } from '../../services/product.service';
import { of, throwError } from 'rxjs';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let mockProductService: any;

  beforeEach(() => {
    mockProductService = {
      checkIdExists: jest.fn(),
      getProductById: jest.fn(),
      createProduct: jest.fn(),
      updateProduct: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, ProductFormComponent],
      providers: [{ provide: ProductService, useValue: mockProductService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('dateValidator', () => {
    it('debería retornar null si la fecha es válida', () => {
      const control = { value: new Date().toISOString().split('T')[0] };
      const result = component.dateValidator()(control);
      expect(result).toBeNull();
    });

    it('debería retornar un error si la fecha es inválida', () => {
      const control = { value: '2020-01-01' };
      const result = component.dateValidator()(control);
      expect(result).toEqual({ invalidDate: true });
    });
  });

  describe('revisionDateValidator', () => {
    it('debería retornar null si la fecha de revisión es exactamente un año después de la de liberación', () => {
      component.productForm.get('dateRelease')?.setValue('2024-01-01');
      const control = { value: '2025-01-01' };
      const result = component.revisionDateValidator()(control);
      expect(result).toBeNull();
    });

    it('debería retornar un error si la fecha de revisión no es un año después de la de liberación', () => {
      component.productForm.get('dateRelease')?.setValue('2024-01-01');
      const control = { value: '2024-06-01' };
      const result = component.revisionDateValidator()(control);
      expect(result).toEqual({ invalidRevisionDate: true });
    });
  });

  describe('onSubmit', () => {
    it('debería crear un producto si el formulario es válido y no está en modo edición', () => {
      mockProductService.createProduct.mockReturnValue(of({}));
      component.isEditMode = false;

      component.productForm.setValue({
        id: '123',
        name: 'Test Product',
        description: 'Test Description',
        logo: 'TS',
        dateRelease: '2024-01-01',
        dateRevision: '2025-01-01',
      });

      component.onSubmit();

      expect(mockProductService.createProduct).toHaveBeenCalledWith({
        id: '123',
        name: 'Test Product',
        description: 'Test Description',
        logo: 'TS',
        date_release: '2024-01-01',
        date_revision: '2025-01-01',
      });
    });
  });
});