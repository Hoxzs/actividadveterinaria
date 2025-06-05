import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatoService } from 'src/app/servicios/dato.service';

@Component({
  selector: 'app-medicina',
  templateUrl: './medicina.component.html',
  styleUrls: ['./medicina.component.css']
})
export class MedicinaComponent implements OnInit {
  titulo = 'Equipos';
  formProducto: FormGroup;
  id: any | null;

  constructor(
    public fb: FormBuilder,
    public datoService: DatoService,
    private router: Router,
    private aRoute: ActivatedRoute
  ) {
    this.formProducto = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      serie: [''],
      empleado: ['', [Validators.required, Validators.min(0.01)]]
    });

    this.id = this.aRoute.snapshot.paramMap.get('idProducto');
  }

  ngOnInit(): void {
    this.esEditar();
  }

  esEditar() {
    if (this.id !== null) {
      this.titulo = 'Editar equipo';
      this.datoService.getProducto(this.id).subscribe(response => {
        this.formProducto.patchValue({
          nombre: response.nombre,
          serie: response.serie,
          empleado: response.empleado
        });
      });
    }
  }

  agregarOEditar(): void {
    if (this.id === null)
      this.agregar();
    else
      this.editar(this.id);
  }

  agregar(): void {
    if (this.formProducto.invalid) {
      return; // Detener la función si el formulario es inválido
    }

    this.datoService.createProducto(this.formProducto.value).subscribe(response => {
      this.router.navigate(['menu']);
    },
    error => {
      console.error(error);
    });
  }

  editar(id: any): void {
    if (this.formProducto.invalid) {
      return; // Detener la función si el formulario es inválido
    }

    const producto: any = {
      nombre: this.formProducto.value.nombre,
      serie: this.formProducto.value.serie,
      empleado: this.formProducto.value.empleado
    };

    this.datoService.updateProducto(id, producto).subscribe(response => {
      this.router.navigate(['ventas']);
    },
    error => {
      console.error(error)
    });
  }

  regresar(): void {
    this.router.navigate(['/inicio']);
  }
}
