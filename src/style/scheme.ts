import {Appearance} from 'react-native';
import {remove, xor, isEmpty, merge} from 'lodash';

export type Schemes = {light: {[key: string]: string}; dark: {[key: string]: string}};
export type SchemeType = 'default' | 'light' | 'dark';
export type SchemeChangeListener = (schemeType?: 'light' | 'dark') => void;

class Scheme {
  currentScheme: SchemeType = 'default';
  schemes: Schemes = {light: {}, dark: {}};
  changeListeners: SchemeChangeListener[] = [];

  constructor() {
    Appearance.addChangeListener(() => {
      if (this.currentScheme === 'default') {
        this.broadcastSchemeChange();
      }
    });
  }

  private broadcastSchemeChange() {
    this.changeListeners.forEach(listener => listener(this.getSchemeType()));
  }

  /**
   * Get app's current color scheme
   */
  getSchemeType(): 'light' | 'dark' {
    const scheme = this.currentScheme === 'default' ? Appearance.getColorScheme() : this.currentScheme;
    return scheme ?? 'light';
  }

  /**
   * Set color scheme for app
   * arguments:
   * scheme - color scheme e.g light/dark/default
   */
  setScheme(scheme: SchemeType) {
    const prevSchemeType = this.getSchemeType();
    if (!['light', 'dark', 'default'].includes(scheme)) {
      throw new Error(`${scheme} is invalid colorScheme, please use 'light' | 'dark' | 'default'`);
    }
    this.currentScheme = scheme;

    if (prevSchemeType !== this.getSchemeType()) {
      this.broadcastSchemeChange();
    }
  }

  /**
   * Load set of schemes for light/dark mode
   * arguments:
   * schemes - two sets of map of colors e.g {light: {screen: 'white'}, dark: {screen: 'black'}}
   */
  loadSchemes(schemes: Schemes) {
    const lightSchemeKeys = Object.keys(schemes.light);
    const darkSchemeKeys = Object.keys(schemes.dark);

    const missingKeys = xor(lightSchemeKeys, darkSchemeKeys);
    if (!isEmpty(missingKeys)) {
      throw new Error(`There is a mismatch in scheme keys: ${missingKeys.join(', ')}`);
    }

    merge(this.schemes, schemes);
  }

  /**
   * Retrieve scheme by current scheme type
   */
  getScheme() {
    return this.schemes[this.getSchemeType()];
  }

  /**
   * Add a change scheme event listener
   */
  addChangeListener(listener: SchemeChangeListener) {
    this.changeListeners.push(listener);
  }

  /**
   * Remove a change scheme event listener
   * arguments:
   * listener - listener reference to remove
   */
  removeChangeListener(listener: SchemeChangeListener) {
    remove(this.changeListeners, changeListener => changeListener === listener);
  }
}

export default new Scheme();
