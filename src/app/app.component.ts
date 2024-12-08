import { Component } from '@angular/core';

/**
 * The root component of the application.
 * Displays the main content and handles global application logic.
 * @since v1.0.0
 * @author Zirun Wang
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  /**
   * The title of the application.
   * @type { string }
   */
  title = 'hot-movie-guide';
}