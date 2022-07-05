import { IArticle, Numbers, IRenderer } from '../../../types';
import './news.css';
import placeholder from '../../../assets/placeholder.png';
import { NUMBER_OF_ARTICLES_PER_PAGE } from '../../../constants';

class NewsRenderer implements IRenderer {
  public draw(data: IArticle[]): void {
    const news: IArticle[] =
      data.length >= NUMBER_OF_ARTICLES_PER_PAGE
        ? data.filter(
            (_item: IArticle, index: number): boolean => index < NUMBER_OF_ARTICLES_PER_PAGE,
          )
        : data;

    const fragment: DocumentFragment = document.createDocumentFragment();
    const newsItemTemplate = document.querySelector('#newsItemTemplate') as HTMLTemplateElement;

    news.forEach((item: IArticle, index: number): void => {
      const newsClone = newsItemTemplate.content.cloneNode(true) as DocumentFragment;

      if (this.isEven(index))
        (newsClone.querySelector('.news__item') as HTMLDivElement).classList.add('alt');

      (newsClone.querySelector(
        '.news__meta-photo',
      ) as HTMLDivElement).style.backgroundImage = `url(${item.urlToImage || placeholder})`;
      (newsClone.querySelector('.news__meta-author') as HTMLLIElement).textContent =
        item.author || item.source.name;
      (newsClone.querySelector(
        '.news__meta-date',
      ) as HTMLLIElement).textContent = item.publishedAt
        .slice(Numbers.Zero, Numbers.Ten)
        .split('-')
        .reverse()
        .join('-');

      (newsClone.querySelector('.news__description-title') as HTMLHeadingElement).textContent =
        item.title;
      (newsClone.querySelector('.news__description-source') as HTMLHeadingElement).textContent =
        item.source.name;
      (newsClone.querySelector('.news__description-content') as HTMLHeadingElement).textContent =
        item.description;
      (newsClone.querySelector('.news__read-more a') as HTMLParagraphElement).setAttribute(
        'href',
        item.url,
      );

      fragment.append(newsClone);
    });

    (document.querySelector('.news') as HTMLDivElement).innerHTML = '';
    (document.querySelector('.news') as HTMLDivElement).appendChild(fragment);
  }

  private isEven(number: number): boolean {
    return !(number % Numbers.Two);
  }
}

export default NewsRenderer;
