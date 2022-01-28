import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  frescuraList = ['Estrenar', 'Segunda Mano', 'Reparado'];
  productForm!: FormGroup;
  actionBTN: string = 'Guardar';
  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private api: ApiService,
    private diaglogRef: MatDialogRef<DialogComponent>
  ) {}

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      categoria: ['', Validators.required],
      fecha: ['', Validators.required],
      frescura: ['', Validators.required],
      precio: ['', Validators.required],
      comentario: ['', Validators.required],
    });

    if (this.editData) {
      this.actionBTN = 'Actualizar';
      this.productForm.controls['productName'].setValue(
        this.editData.productName
      );
      this.productForm.controls['categoria'].setValue(this.editData.categoria);
      this.productForm.controls['fecha'].setValue(this.editData.fecha);
      this.productForm.controls['frescura'].setValue(this.editData.frescura);
      this.productForm.controls['precio'].setValue(this.editData.precio);
      this.productForm.controls['comentario'].setValue(
        this.editData.comentario
      );
    }
  }

  addProduct() {
    if (!this.editData) {
      if (this.productForm.valid) {
        this.api.postProduct(this.productForm.value).subscribe({
          next: (res) => {
            this.productForm.reset();
            this.diaglogRef.close('save');
          },
          error: () => {
            alert('Paso algo');
          },
        });
      }
    } else {
      this.updateProduct();
    }
  }

  updateProduct() {
    this.api.putProduct(this.productForm.value, this.editData.id).subscribe({
      next: (res) => {
        this.productForm.reset();
        this.diaglogRef.close('update');
      },
      error: () => {
        alert('Paso algo');
      },
    });
  }
}
