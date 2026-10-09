import { GuidesPage, guidesText } from '@/components/pages/guides';
import { pageMetadata } from '@/lib/meta';

const { title, description } = guidesText('pt-BR');
export const metadata = pageMetadata('pt-BR', '/guides/', title, description);

export default function Page() {
  return <GuidesPage locale="pt-BR" />;
}
