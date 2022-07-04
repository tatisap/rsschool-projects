import { Article, Renderer } from '../../../types';
import './news.css';
import placeholder from '../../../assets/placeholder.png';

class NewsRenderer implements Renderer {
    public draw(data: Article[]): void {
        const news: Article[] = data.length >= 10 ? data.filter((_item: Article, index: number) => index < 10) : data;

        const fragment: DocumentFragment = document.createDocumentFragment();
        const newsItemTemplate = document.querySelector('#newsItemTemplate') as HTMLTemplateElement;

        news.forEach((item: Article, index: number) => {
            const newsClone = newsItemTemplate.content.cloneNode(true) as DocumentFragment;

            if (index % 2) (newsClone.querySelector('.news__item') as HTMLDivElement).classList.add('alt');

            (newsClone.querySelector('.news__meta-photo') as HTMLDivElement).style.backgroundImage = `url(${
                item.urlToImage || placeholder
            })`;
            (newsClone.querySelector('.news__meta-author') as HTMLLIElement).textContent =
                item.author || item.source.name;
            (newsClone.querySelector('.news__meta-date') as HTMLLIElement).textContent = item.publishedAt
                .slice(0, 10)
                .split('-')
                .reverse()
                .join('-');

            (newsClone.querySelector('.news__description-title') as HTMLHeadingElement).textContent = item.title;
            (newsClone.querySelector('.news__description-source') as HTMLHeadingElement).textContent = item.source.name;
            (newsClone.querySelector('.news__description-content') as HTMLHeadingElement).textContent =
                item.description;
            (newsClone.querySelector('.news__read-more a') as HTMLParagraphElement).setAttribute('href', item.url);

            fragment.append(newsClone);
        });

        (document.querySelector('.news') as HTMLDivElement).innerHTML = '';
        (document.querySelector('.news') as HTMLDivElement).appendChild(fragment);
    }
}

export default NewsRenderer;
