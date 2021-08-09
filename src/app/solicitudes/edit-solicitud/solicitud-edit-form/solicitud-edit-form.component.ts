import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Cliente, SolicitudDeDeposito, UpdateSolicitud } from '@papx/models';
import { merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/core';

@Component({
  selector: 'papx-solicitud-edit-form',
  templateUrl: './solicitud-edit-form.component.html',
  styleUrls: ['./solicitud-edit-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudEditFormComponent
  extends BaseComponent
  implements OnInit {
  @Input() solicitud: Partial<SolicitudDeDeposito>;
  @Output() save = new EventEmitter<Partial<SolicitudDeDeposito>>();
  form: FormGroup;
  controls: { [key: string]: AbstractControl };

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.form = this.buildForm();
    this.setControls();
    this.form.patchValue(this.solicitud, { emitEvent: false });

    this.registerTransferenciaListener();
    this.registerEfectivoChequeListener();
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      cliente: [null, [Validators.required]],
      banco: [null, [Validators.required]],
      cuenta: [null, [Validators.required]],
      efectivo: [null, [Validators.min(0.0)]],
      cheque: [null, [Validators.min(0.0)]],
      transferencia: [null, [Validators.min(0.0)]],
      total: [null, [Validators.required, Validators.min(10.0)]],
      referencia: [null, [Validators.required]],
      fechaDeposito: [null, [Validators.required]],
    });
  }

  private setControls() {
    this.controls = {
      total: this.form.get('total'),
      transferencia: this.form.get('transferencia'),
      efectivo: this.form.get('efectivo'),
      cheque: this.form.get('cheque'),
    };
  }

  private getDepositoControls() {
    return [this.form.get('cheque'), this.form.get('efectivo')];
  }

  private disableDepositos(value: boolean) {
    const controls = this.getDepositoControls();
    if (value) {
      controls.forEach((ctrl) => {
        ctrl.disable({ emitEvent: false });
        ctrl.setValue(0.0, { onlySelf: true, emitEvent: false });
      });
    } else {
      controls.forEach((ctrl) => ctrl.enable());
    }
  }

  private registerTransferenciaListener() {
    this.form
      .get('transferencia')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((sval) => {
        const transf = (sval as number) || 0.0;
        this.disableDepositos(transf > 0);
        this.form.get('total').setValue(transf);
      });
  }

  private registerEfectivoChequeListener() {
    const efectivo = this.form.get('efectivo');
    const cheque = this.form.get('cheque');
    merge(efectivo.valueChanges, cheque.valueChanges)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const ef = (efectivo.value as number) || 0.0;
        const che = (cheque.value as number) || 0.0;
        const total = ef + che;
        this.form.get('total').setValue(total);
      });
  }
  getSbc(): boolean {
    const cheque = this.form.get('cheque').value;
    if (cheque > 0.0) {
      const banco = this.form.get('banco').value;
      const cuenta = this.form.get('cuenta').value;
      return banco.id !== cuenta.banco;
    } else {
      return false;
    }
  }

  isImportesDirty() {
    return this.form.get('total').dirty;
  }

  onSubmit() {
    if (this.form.valid) {
      const changes: Partial<SolicitudDeDeposito> = this.perpare(this.form);
      this.save.emit(changes);
    }
  }

  private perpare(form: FormGroup): Partial<SolicitudDeDeposito> {
    return {
      ...this.form.getRawValue(),
      cliente: this.getCliente(),
      sbc: this.getSbc(),
    };
  }

  getCliente(): Partial<Cliente> {
    const { id, clave, nombre } = this.form.get('cliente').value;
    return { id, clave, nombre };
  }
}
