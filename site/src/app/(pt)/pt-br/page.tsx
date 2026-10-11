import { HomePage } from '@/components/pages/home';
import { libNames, loadLibs } from '@/lib/data';
import { pageMetadata } from '@/lib/meta';

export const metadata = pageMetadata(
  'pt-BR',
  '/',
  `Brazilian Utils: validar CPF, CNPJ, CEP e mais em ${loadLibs().length} linguagens`,
  `Valide, formate, interprete e gere documentos brasileiros (CPF, CNPJ, CEP, placas) em ${libNames('pt-BR')}, com um contrato compartilhado.`,
);

export default function Page() {
  return <HomePage locale="pt-BR" />;
}
