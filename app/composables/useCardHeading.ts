import type { InjectionKey } from 'vue';

// Card titles sit one level below their section: h2 under the page h1 by default, h3 on pages that
// group cards under h2 sections (they call provideCardHeading('h3')).
const cardHeadingKey: InjectionKey<'h2' | 'h3'> = Symbol('card heading');

export const provideCardHeading = (tag: 'h2' | 'h3') => provide(cardHeadingKey, tag);
export const useCardHeading = () => inject(cardHeadingKey, 'h2');
