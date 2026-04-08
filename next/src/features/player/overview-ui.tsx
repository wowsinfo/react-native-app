import { ReactNode } from 'react';

import type {
  OverviewListItem,
  OverviewSection,
} from '@/features/player/overview';
import {
  ListRow,
  MetricGrid,
  MetricTile,
  Section,
} from '@/features/player/ui';

type MetricSectionBlockProps = {
  title: string;
  subtitle?: string;
  sections: OverviewSection[];
};

type ListSectionBlockProps = {
  title: string;
  subtitle?: string;
  items: OverviewListItem[];
  footer?: ReactNode;
};

export function MetricSectionBlock({
  title,
  subtitle,
  sections,
}: MetricSectionBlockProps) {
  if (sections.length === 0) {
    return null;
  }

  return (
    <Section title={title} subtitle={subtitle}>
      {sections.map(section => (
        <MetricGrid key={section.title}>
          {section.metrics.map(metric => (
            <MetricTile
              key={`${section.title}-${metric.label}`}
              label={metric.label}
              value={metric.value}
            />
          ))}
        </MetricGrid>
      ))}
    </Section>
  );
}

export function ListSectionBlock({
  title,
  subtitle,
  items,
  footer,
}: ListSectionBlockProps) {
  if (items.length === 0 && !footer) {
    return null;
  }

  return (
    <Section title={title} subtitle={subtitle}>
      {items.map(item => (
        <ListRow
          key={item.title}
          title={item.title}
          description={item.description}
          trailing={item.trailing}
        />
      ))}
      {footer}
    </Section>
  );
}
