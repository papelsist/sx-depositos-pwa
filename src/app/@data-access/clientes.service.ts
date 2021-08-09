import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { combineLatest, Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay, switchMap, take } from 'rxjs/operators';

import { Cliente, ClienteDto } from '@papx/models';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';

import sortBy from 'lodash-es/sortBy';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  clientesCredito$ = this.fetchClientesCredito().pipe(
    shareReplay(),
    catchError((error: any) => throwError(error))
  );

  clientesCache$ = this.fetchClientesCache().pipe(
    map((clientes) => sortBy(clientes, 'nombre')),
    shareReplay()
  );

  constructor(
    private http: HttpClient,
    private afs: AngularFirestore,
    private fs: AngularFireStorage
  ) {}

  fetchClientesCache(): Observable<ClienteDto[]> {
    if (environment.useEmulators) {
      return this.fetchClientesCacheForEmulator();
    }
    const ref = this.fs.ref('catalogos/ctes-all.json');
    return ref.getDownloadURL().pipe(
      switchMap((url) =>
        this.http.get<any[]>(url).pipe(
          map((rows) =>
            rows.map((i) => {
              const res: ClienteDto = {
                id: i.i,
                nombre: i.n,
                rfc: i.r,
                clave: i.cv,
                credito: !!i.cr,
              };
              return res;
            })
          )
        )
      ),
      catchError((err) => {
        const { code, message } = err;
        return throwError({ code, message });
      })
    );
  }

  fetchClientesCacheForEmulator(): Observable<ClienteDto[]> {
    const url =
      'https://firebasestorage.googleapis.com/v0/b/papx-ws-dev.appspot.com/o/catalogos%2Fctes-all.json?alt=media&token=6c6b0dfa-b3ad-4e9a-8886-431e5950b675';
    return this.http.get<any[]>(url).pipe(
      map((rows) =>
        rows.map((i) => {
          const res: ClienteDto = {
            id: i.i,
            nombre: i.n,
            rfc: i.r,
            clave: i.cv,
            credito: !!i.cr,
          };
          return res;
        })
      )
    );
  }

  fetchClientesCredito(): Observable<Partial<Cliente>[]> {
    return this.fs
      .ref('catalogos/ctes-cre.json')
      .getDownloadURL()
      .pipe(
        switchMap((url) => this.http.get<Cliente[]>(url)),
        catchError((err) =>
          throwError('Error descargando clientes de credito ' + err.message)
        )
      );
  }

  /**
   * .collection('clientes')
      .where('nombre', '>=', 'PAPELSA')
      .orderBy('nombre', 'asc')
   * @param term
   */
  searchClientes(term: string, limit = 5) {
    return combineLatest([
      this.serachByRfc(term, limit),
      this.searchByNombre(term),
    ]).pipe(map(([b1, b2]) => [...b1, ...b2]));
  }

  searchByNombre(term: string, limit = 5) {
    return this.afs
      .collection<Cliente>('clientes', (ref) =>
        ref
          .where('nombre', '>=', term.toUpperCase())
          .orderBy('nombre', 'asc')
          .limit(limit)
      )
      .valueChanges()
      .pipe(take(1));
  }

  serachByRfc(rfc: string, limit = 1) {
    // PBA0511077F9;
    return this.afs
      .collection<Cliente>('clientes', (ref) =>
        ref.where('rfc', '==', rfc.toUpperCase()).limit(limit)
      )
      .valueChanges()
      .pipe(take(1));
  }

  findById(id: string) {
    return this.afs
      .doc<Cliente>(`clientes/${id}`)
      .valueChanges()
      .pipe(
        take(1),
        catchError((err) =>
          throwError('Error fetching cliente from firestore ' + err.message)
        )
      );
  }
}
