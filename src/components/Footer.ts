import Element, { h, t } from './Element';

export class Footer extends Element {
  constructor() {
    super(
      'p.footer',
      h(
        'small',
        t(
          'This site is not affiliated with Aquabeads® or EPOCH. Aquabeads® is a registered trademark of EPOCH.'
        ),
        h('br'),
        t('Some icons courtesy of '),
        h('a[href="https://icons8.com/"][target="_blank"]', t('icons8.com')),
        t('.')
      )
    );
  }
}

export default Footer;
