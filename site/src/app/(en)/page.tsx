import { HomePage } from '@/components/pages/home';
import { libNames, loadLibs } from '@/lib/data';
import { pageMetadata } from '@/lib/meta';

export const metadata = pageMetadata(
  'en',
  '/',
  `Brazilian Utils: validate CPF, CNPJ, CEP and more in ${loadLibs().length} languages`,
  `Validate, format, parse and generate Brazilian documents (CPF, CNPJ, CEP, license plates) in ${libNames('en')}, with one shared contract.`,
);

export default function Page() {
  return <HomePage locale="en" />;
}
