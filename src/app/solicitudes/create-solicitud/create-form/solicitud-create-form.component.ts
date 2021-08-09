import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { merge, Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Cartera, Cliente, SolicitudDeDeposito } from '@papx/models';

@Component({
  selector: 'papx-solicitud-create-form',
  templateUrl: './solicitud-create-form.component.html',
  styleUrls: ['./solicitud-create-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudCreateFormComponent implements OnInit, OnDestroy {
  @Output() save = new EventEmitter<Partial<SolicitudDeDeposito>>();
  @Output() cancelar = new EventEmitter();
  @Output() valueReady = new EventEmitter<Partial<SolicitudDeDeposito>>();
  @Output() lookupPedido = new EventEmitter();
  @Input() tipo: Cartera;
  @Input() sucursal: string;
  @Input() solcita: string;
  form: FormGroup;

  controls: { [key: string]: AbstractControl };

  destroy$ = new Subject<boolean>();
  _pedido: any;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.buildForm();
    this.setControls();

    const payload = {
      transferencia: 0.0,
      efectivo: 0.0,
      cheque: 0.0,
      total: 0.0,
    };
    this.form.patchValue(payload);

    this.registerTransferenciaListener();
    this.registerEfectivoChequeListener();
    this.validacionDeNoDuplicados();
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      fecha: [new Date().toISOString(), Validators.required],
      cliente: [null, [Validators.required]],
      banco: [null, [Validators.required]],
      cuenta: [null, [Validators.required]],
      efectivo: [null, [Validators.min(0.0)]],
      cheque: [null, [Validators.min(0.0)]],
      transferencia: [null, [Validators.min(0.0)]],
      total: [null, [Validators.required, Validators.min(10.0)]],
      referencia: [null, [Validators.required]],
      fechaDeposito: [null, [Validators.required]],
      solicita: [this.solcita, [Validators.required]],
      sucursal: [
        { value: this.sucursal, disabled: true },
        [Validators.required],
      ],
      tipo: ['CON', [Validators.required]],
    });
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

  private validacionDeNoDuplicados() {
    const fechaDeposito$ = this.form.get('fechaDeposito').valueChanges;
    const total$ = this.form.get('total').valueChanges;
    const banco$ = this.form.get('banco').valueChanges;
    const cuenta$ = this.form.get('cuenta').valueChanges;
    const merg = combineLatest([fechaDeposito$, total$, banco$, cuenta$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([fechaDeposito, total, banco, cuenta]) => {
        const command = { fechaDeposito, total, banco, cuenta };
        this.valueReady.emit(command);
      });
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

  private setControls() {
    this.controls = {
      total: this.form.get('total'),
      transferencia: this.form.get('transferencia'),
      efectivo: this.form.get('efectivo'),
      cheque: this.form.get('cheque'),
      cliente: this.form.get('cliente'),
    };
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  isImportesDirty() {
    // const controls = [this.controls.efectivo, this.controls.cheue, this.controls.transferencia];
    return this.form.get('total').dirty;
  }

  onSubmit() {
    if (this.form.valid) {
      const cliente = this.getCliente();
      let payload: Partial<SolicitudDeDeposito> = {
        ...this.form.getRawValue(),
        cliente,
        sbc: this.getSbc(),
        status: 'PENDIENTE',
      };
      if (this.pedido) {
        payload = { ...payload, pedido: this.pedido };
      }
      this.save.emit(payload);
    }
  }

  getCliente(): Partial<Cliente> {
    const { id, clave, nombre } = this.form.get('cliente').value;
    return { id, clave, nombre };
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

  get pedido(): any {
    return this._pedido;
  }

  @Input()
  set pedido(value: any) {
    if (value) {
      const {
        id,
        folio,
        fecha,
        total,
        formaDePago,
        cliente,
        sucursal,
        sucursalId,
        updateUser,
      } = value;
      this._pedido = { id, folio, fecha, total, formaDePago, updateUser };

      // this.controls.sucursal.setValue({ id: sucursalId, nombre: sucursal });
      this.controls.cliente.setValue(cliente);
      // this.controls.sucursal.disable();
      this.controls.cliente.disable();
      switch (formaDePago) {
        case 'TRANSFERENCIA':
          this.controls.transferencia.setValue(total);
          break;
        case 'DEPOSITO_EFECTIVO':
          this.controls.efectivo.setValue(total);
          break;
        case 'DEPOSITO_CHEQUE':
          this.controls.cheque.setValue(total);
          break;
        default:
          break;
      }
    } else {
      if (this._pedido && this.form) {
        // this.controls.sucursal.setValue(null);
        this.controls.cliente.setValue(null);
        // this.controls.sucursal.enable();
        this.controls.cliente.enable();
        this.controls.transferencia.setValue(0);
        this.controls.cheque.setValue(0);
        this.controls.efectivo.setValue(0);
      }
      this._pedido = value;
    }
  }
}
