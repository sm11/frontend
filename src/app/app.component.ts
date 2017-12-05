import { ChangeDetectorRef, Component } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-root', // Specifies a CSS selector that identifies this directive within a template.
                        // Supported selectors include element, [attribute], .class, and :not().
                        // Does not support parent-child relationship selectors.

  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Hope';
  mobileQuery: MediaQueryList;

  //fillerNav = Array(50).fill(0).map((_, i) => `Nav Item ${i + 1}`);

  fillerNav = [{icon:"perm_media", name:"My Evidence Logs"}, {icon:'event', name:'My Appointments'}, {icon:'explore', name:'Service Finder'}, {icon:'assignment', name:'Plan Your Visit'}, {icon:'library_books', name:'My Case Documents'}];
  //fillerContent = Array(1).fill(0).map(() =>``);


  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
