import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatosService } from 'src/app/servicios/datos.service';
import * as jsPDF from 'jspdf';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, ValidationErrors } from '@angular/forms';


@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {
  titulo = 'Empleados';
  submitted = false;
  formDato: FormGroup;
  id: any | null;

  constructor(
    public fb: FormBuilder,
    public datoService: DatosService,
    private router: Router,
    private aRoute: ActivatedRoute,
    private http: HttpClient
  ) {
    this.formDato = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('[A-Za-zÁ-Úá-ú ]+')]],
      curp: ['', [Validators.required, this.validarCurp]], // Aquí se aplica la validación personalizada
      salario: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      fechanacimiento: ['', [Validators.required, this.validarFechaNacimiento]],
    });

    this.id = this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.esEditar();
  }

  esEditar() {
    if (this.id !== null) {
      this.titulo = 'Veterinario';
      this.datoService.getUser(this.id).subscribe(response => {
        this.formDato.setValue({
          id: response.id,
          nombre: response.nombre,
          curp: response.curp,
          salario: response.salario,
          fechanacimiento: response.fechanacimiento,
        });
      });
    }
  }

  agregarOEditar(): void {
    this.formDato.markAllAsTouched();
    this.submitted = true;
    if (this.formDato.invalid) {
      return;
    }

    if (this.id === null)
      this.agregar();
    else
      this.editar(this.id);
  }

  agregar(): void {
    this.datoService.createUser(this.formDato.value).subscribe(response => {
      this.router.navigate(['menu']);
    },
    error => {
      console.error(error);
    });
  }

  editar(id: any): void {
    const dato: any = {
      id: this.formDato.value.id,
      nombre: this.formDato.value.nombre,
      curp: this.formDato.value.curp,
      salario: this.formDato.value.salario,
      fechanacimiento: this.formDato.value.fechanacimiento,
    };

    this.datoService.updateUser(id, dato).subscribe(response => {  
      this.router.navigate(['lista-usuarios']);
    },
    error => {
      console.error(error)
    });
  }

  validarFechaNacimiento(control: any): {[key: string]: any} | null {
    const fechaNacimiento = new Date(control.value);
    const fechaActual = new Date();
    const edadMaxima = 100; 

    const edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
    if (edad < 18 || edad > edadMaxima) {
      return { 'invalidAge': true };
    }
    return null;
  }

   validarCurp(control: AbstractControl): ValidationErrors | null {
    const curpRegex = /^[A-Za-z]{4}[0-9]{6}[A-Za-z]{6}[0-9A-Za-z]{2}$/;
    if (control.value && !curpRegex.test(control.value)) {
        return { 'invalidCurp': true };
    }
    return null;
}

}
