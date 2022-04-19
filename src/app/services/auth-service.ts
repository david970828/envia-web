import {SupportedLanguagesEnum} from "../enums/supported-languages";
import { TranslateService } from "@ngx-translate/core";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthService {

  selectedLanguage: string;

  constructor(public translate: TranslateService) {
    this.selectedLanguage = 'es';
    this.setDefaultLanguage();
  }

  setDefaultLanguage() {
    this.translate.addLangs(
      // @ts-ignore
      Object.keys(SupportedLanguagesEnum).map((key) => SupportedLanguagesEnum[key])
    );
    this.translate.setDefaultLang(SupportedLanguagesEnum.En);

    const browserLang = this.translate.getBrowserLang();
    browserLang.match(/en|es/) ? this.setLanguage(browserLang) : this.setLanguage(SupportedLanguagesEnum.En);
  }

  setLanguage(language: string) {
    this.translate.use(language);
    this.selectedLanguage = language.charAt(0).toUpperCase() + language.slice(1);
  }
}
