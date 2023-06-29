import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ClienteViewVacio } from 'src/app/modelos/entidades-vacias';
import { ClienteView } from 'src/app/services/api/api-promodel';
import { SessionQuery } from 'src/app/state/session.query';

@Component({
    selector: 'app-footer-style-one',
    templateUrl: './footer-style-one.component.html',
    styleUrls: ['./footer-style-one.component.scss']
})
export class FooterStyleOneComponent implements OnInit, OnDestroy {

    private destroy$ = new Subject();
    c: ClienteView  = ClienteViewVacio();
    constructor(private session: SessionQuery) { }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
      }

    ngOnInit(): void {
        this.session.cliente$.pipe(takeUntil(this.destroy$)).subscribe(c=> {
            this.c = c;
        });
    }

}