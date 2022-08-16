import Element, { h, t } from './Element';

export class Footer extends Element {
  constructor() {
    super(
      'p.footer',
      h(
        'small',
        t(
          'This site is not affiliated with Aquabeads® or EPOCH. Aquabeads® is a registered trademark of EPOCH.'
        )
      )
    );
  }
}

export default Footer;
