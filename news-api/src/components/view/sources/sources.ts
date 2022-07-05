import { IRenderer, ISource } from '../../../types';
import './sources.css';

class SourcesRenderer implements IRenderer {
  public draw(data: ISource[]): void {
    const fragment: DocumentFragment = document.createDocumentFragment();
    const sourceItemTemplate = document.querySelector('#sourceItemTemplate') as HTMLTemplateElement;

    data.forEach((item: ISource): void => {
      const sourceClone = sourceItemTemplate.content.cloneNode(true) as DocumentFragment;

      (sourceClone.querySelector('.source__item-name') as HTMLSpanElement).textContent = item.name;
      (sourceClone.querySelector('.source__item') as HTMLDivElement).setAttribute(
        'data-source-id',
        item.id,
      );

      fragment.append(sourceClone);
    });

    (document.querySelector('.sources') as HTMLDivElement).append(fragment);
  }
}

export default SourcesRenderer;
