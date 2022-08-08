export default (event: Event): void => {
  if (!(event.target as HTMLElement).classList.contains('tab-button')) return;
  const tab = event.target as HTMLButtonElement;
  (document.querySelectorAll('.tab-button') as NodeListOf<HTMLButtonElement>).forEach(
    (tabButton: HTMLButtonElement) => tabButton.classList.remove('tab-button_active')
  );
  tab.classList.add('tab-button_active');
  (document.querySelectorAll('section') as NodeListOf<HTMLElement>).forEach(
    (tabContent: HTMLElement) => {
      const content: HTMLElement = tabContent;
      content.classList.remove('section_visible');
    }
  );
  (document.getElementById(tab.textContent?.toLowerCase() as string) as HTMLElement).classList.add(
    'section_visible'
  );
};
