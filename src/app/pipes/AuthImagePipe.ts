import { HttpClient, HttpResponse } from "@angular/common/http";
import { ChangeDetectorRef, Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { BehaviorSubject, of, Subscription } from "rxjs";
import { catchError, distinctUntilChanged, filter, map, switchMap, tap } from "rxjs/operators";

@Pipe({
  name: 'authImage',
  pure: false,
})
export class UseHttpImageSourcePipe implements PipeTransform {
  private subscription = new Subscription();
  private transformValue = new BehaviorSubject<string>('');

  private latestValue!: string | SafeUrl;
  private errorImagePath!: string;
  
  constructor(private httpClient: HttpClient,
              private domSanitizer: DomSanitizer,
              private cdr: ChangeDetectorRef) {
                this.setUpSubscription();
              }

transform(imagePath: string): string | SafeUrl {
    // we emit a new value
    this.transformValue.next(imagePath);

    // we always return the latest value
    return this.latestValue;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private setUpSubscription(): void {
    const transformSubscription = this.transformValue
      .asObservable()
      .pipe(
        // we filter out empty strings and falsy values
        filter((v): v is string => !!v),
        // we don't emit if the input hasn't changed
        distinctUntilChanged(),
        switchMap((imagePath: string) => this.httpClient
        .get(imagePath, { observe: 'response', responseType: 'blob' })
        .pipe(
          map((response: HttpResponse<Blob>) => URL.createObjectURL(response.body)),
          map((unsafeBlobUrl: string) => this.domSanitizer.bypassSecurityTrustUrl(unsafeBlobUrl)),
          filter((blobUrl) => blobUrl !== this.latestValue),
          // if the request errors out we return the error image's path value
          catchError(() => of(this.errorImagePath))
        )
      ),
        tap((imagePath: string | SafeUrl) => {
        // we set the latestValue property of the pipe
        this.latestValue = imagePath;
        // and we mark the DOM changed, so the pipe's transform method is called again
        this.cdr.markForCheck();
      })
      )
      .subscribe();
    this.subscription.add(transformSubscription);
  }
}

