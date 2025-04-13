import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Directive({
  selector: '[safeHtml]',
  standalone: true
})
export class SafeHtmlDirective implements OnChanges {
  @Input() safeHtml: string = '';

  constructor(
    private elementRef: ElementRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnChanges(): void {
    this.elementRef.nativeElement.innerHTML = this.sanitizer
      .bypassSecurityTrustHtml(this.safeHtml)
      .toString();
  }
}