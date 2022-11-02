import { Component } from '@angular/core';
import { CACHE_SIZE_UNLIMITED, enableIndexedDbPersistence, Firestore, initializeFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AuthService } from './services';
import { AppUpdateService } from './services/app-update.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private db: Firestore,
    private authService: AuthService,
    private router: Router,
    private appUpdateService: AppUpdateService,
    ) {
      this.appUpdateService.subscribeUpdate();
    enableIndexedDbPersistence(db)
      .catch((err) => {
        if (err.code === 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
        } else if (err.code === 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
        }
      });
      authService.getAuthState().subscribe(
        res => {
          if (res) {
            router.navigate(['establishments']);
          }
        }
      );
  }
}
