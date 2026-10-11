import { LibPage } from '@/components/pages/lib';
import { loadLibs } from '@/lib/data';
import { libMetadata } from '@/lib/meta';

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => loadLibs().map((l: any) => ({ id: l.id }));
export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const lib = loadLibs().find((l: any) => l.id === id);
  return libMetadata('pt-BR', lib);
}

export default async function Page({ params }: Props) {
  return <LibPage locale="pt-BR" id={(await params).id} />;
}
