'use client';
// The documentation's header (site-header.client.tsx has the row it shares with the home page), in
// a file of its own: its menu needs the documentation layout, which the home page should not load.
import { useNotebookLayout } from 'fumadocs-ui/layouts/notebook';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { Sidebar } from 'lucide-react';
import { HeaderRow, type HeaderProps } from '@/components/site-header.client';

/** In the documentation: the grid's header row, full width (its content does not size the grid's
 * columns); the menu opens the sidebar drawer. */
export function DocsHeader(props: HeaderProps) {
  const { slots } = useNotebookLayout();
  const Trigger = slots.sidebar?.trigger;
  return (
    <HeaderRow
      {...props}
      slots={slots}
      main="nd-page"
      className="sticky top-(--fd-docs-row-1) [grid-area:header] [grid-column:1/-1]! [contain:inline-size] layout:[--fd-header-height:--spacing(14)]"
      menu={
        Trigger && (
          <Trigger aria-label={props.menuLabel} className={buttonVariants({ variant: 'ghost', size: 'icon-sm', className: '-me-1.5 p-2 text-fd-muted-foreground lg:hidden' })}>
            <Sidebar />
          </Trigger>
        )
      }
    />
  );
}
