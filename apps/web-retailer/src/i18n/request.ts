import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

const SUPPORTED_LOCALES = ['pt-BR', 'en', 'es'] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

function isSupported(locale: string): locale is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(locale);
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const localeCookie = cookieStore.get('locale')?.value;
  let locale: Locale = 'pt-BR';

  if (localeCookie && isSupported(localeCookie)) {
    locale = localeCookie;
  } else {
    const acceptLang = headerStore.get('accept-language') ?? '';
    if (acceptLang.includes('en')) locale = 'en';
    else if (acceptLang.includes('es')) locale = 'es';
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
