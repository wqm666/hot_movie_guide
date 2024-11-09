import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module'; // 确认引入路径

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
