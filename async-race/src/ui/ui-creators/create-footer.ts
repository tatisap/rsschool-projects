import { FOOTER_INNER_TEXT, GITHUB_LINK } from '../../constants/others-constants';
import { createParentUIElement, createUIElement } from './create-general-element';

export default (): HTMLElement => {
  const githubLinkElement: HTMLAnchorElement = createUIElement<HTMLAnchorElement>({
    tag: 'a',
    classNames: ['github-link'],
    innerText: FOOTER_INNER_TEXT.github,
  });
  githubLinkElement.href = GITHUB_LINK;
  return createParentUIElement<HTMLDivElement>({
    tag: 'footer',
    classNames: ['footer'],
    children: [
      createParentUIElement<HTMLDivElement>({
        tag: 'div',
        classNames: ['footer__info'],
        innerText: FOOTER_INNER_TEXT.year,
        children: [githubLinkElement],
      }),
      createUIElement<HTMLAnchorElement>({
        tag: 'a',
        classNames: ['rs-link'],
      }),
    ],
  });
};
