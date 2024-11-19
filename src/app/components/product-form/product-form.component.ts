import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { catchError, debounceTime, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
  standalone: true,
  imports: [
    FormsModule, CommonModule, ReactiveFormsModule
  ],
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode: boolean = false; // Para distinguir entre creación y edición
  submissionMessage: string = '';
  productId: string | null = null;
  idExists: boolean | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    public route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      id: [
        { value: '', disabled: this.isEditMode }, // ID deshabilitado en modo edición
        [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
      ],
      name: [
        '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(100)],
      ],
      description: [
        '',
        [Validators.required, Validators.minLength(10), Validators.maxLength(200)],
      ],
      logo: ['', Validators.required],
      dateRelease: ['', [Validators.required, this.dateValidator()]],
      dateRevision: ['', [Validators.required, this.revisionDateValidator()]],
    });

  }

  ngOnInit() {
    // Detectar si es modo edición
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.productId = id;
        this.loadProductData(id); // Cargar datos del producto para editar
      } else {
          // Verificar la existencia del ID en tiempo real
          this.productForm
          .get('id')
          ?.valueChanges.pipe(
            debounceTime(500), // Esperar 500ms antes de hacer la verificación
            switchMap((id: string) =>
              id.length >= 3
                ? this.productService.checkIdExists(id).pipe(
                    catchError(() => {
                      this.idExists = null;
                      return of(null);
                    })
                  )
                : of(null)
            )
          )
          .subscribe((exists) => {
            this.idExists = exists;
            if (exists) {
              this.productForm.get('id')?.setErrors({ idExists: true });
            } else {
              this.productForm.get('id')?.setErrors(null);
            }
          });
            }
          });
  }

  loadProductData(id: string) {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          id: product.id,
          name: product.name,
          description: product.description,
          logo: product.logo,
          dateRelease: product.date_release,
          dateRevision: product.date_revision,
        });
        this.productForm.controls['id'].disable();
      },
      error: (err) => {
        console.error('Error al cargar producto:', err);
      },
    });
  }

  dateValidator() {
    return (control: any) => {
      // console.log('control.value -> ', control.value);
      const selectedDate = new Date(control.value);
      selectedDate.setDate(selectedDate.getDate() + 1);
      const currentDate = new Date();
      currentDate.setHours(0); 
      currentDate.setMinutes(0); 
      currentDate.setSeconds(0);
      // console.log('selectedDate -> ', selectedDate, currentDate);
      
      return selectedDate >= currentDate ? null : { invalidDate: true };
    };
  }

  revisionDateValidator() {
    return (control: any) => {
      const release = new Date(this.productForm?.get('dateRelease')?.value);
      const revision = new Date(control.value);
      // Validar que sea exactamente un año posterior
      if (
        revision.getFullYear() === release.getFullYear() + 1 &&
        revision.getMonth() === release.getMonth() &&
        revision.getDate() === release.getDate()
      ) {
        return null; // Válido
      }
      return { invalidRevisionDate: true }; // Inválido

    };
  }

  onSubmit() {
    if (this.productForm.valid) {
      const productData = {
        name: this.productForm.get('name')?.value,
        description: this.productForm.get('description')?.value,
        logo: this.productForm.get('logo')?.value,
        date_release: this.productForm.get('dateRelease')?.value,
        date_revision: this.productForm.get('dateRevision')?.value,
        id: this.productForm.get('id')?.value,
      };

      if (this.isEditMode && this.productId) {
        // Actualizar producto
        delete productData.id
        this.productService.updateProduct(this.productId, productData).subscribe({
          next: (response) => {
            this.submissionMessage = 'Producto actualizado exitosamente.';
            this.router.navigate(['/products']); // Volver a la lista
          },
          error: (error) => {
            console.error('Error al actualizar producto:', error);
            this.submissionMessage = 'Error al actualizar producto.';
          },
        });
      } else {
        // Crear producto
        console.log('Crear producto -> ', productData);
        this.productService.createProduct(productData).subscribe({
          next: (response) => {
            this.submissionMessage = 'Producto creado exitosamente.';
            this.router.navigate(['/products']); // Volver a la lista
          },
          error: (error) => {
            console.error('Error al crear producto:', error);
            this.submissionMessage = 'Error al crear producto.';
          },
        });
      }
    }
  }

  getErrorMessage(controlName: string) {
    const control = this.productForm.get(controlName);
    if (control?.hasError('required')) {
      return `${controlName} es requerido`;
    }
    if (control?.hasError('minlength')) {
      return `${controlName} es demasiado corto`;
    }
    if (control?.hasError('maxlength')) {
      return `${controlName} es demasiado largo`;
    }
    if (control?.hasError('invalidDate')) {
      return `La fecha debe ser igual o mayor a hoy`;
    }
    if (control?.hasError('invalidRevisionDate')) {
      return `La fecha debe ser un exactamente año posterior a la fecha de liberación`;
    }
    if (control?.hasError('idExists')) {
      return `El ID ya existe, elige otro`;
    }
    return '';
  }

  resetForm() {
    this.productForm.reset();
    this.submissionMessage = '';
  }
}