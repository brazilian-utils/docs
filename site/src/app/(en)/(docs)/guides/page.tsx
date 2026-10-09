import { GuidesPage, guidesText } from '@/components/pages/guides';
import { pageMetadata } from '@/lib/meta';

const { title, description } = guidesText('en');
export const metadata = pageMetadata('en', '/guides/', title, description);

export default function Page() {
  return <GuidesPage locale="en" />;
}
