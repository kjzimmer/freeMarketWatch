export interface Topic {
  slug: string;
  title: string;
  description: string;
  tag: string;
  route: string;
  cta: string;
}

export const TOPICS: Topic[] = [
  {
    slug: 'thm',
    title: 'THM — The Benchmark That Changes Everything',
    description: "How we calculate the fixed ruler, why it's hard, and what three economic frameworks say the answer should be. An honest look at an open question.",
    tag: 'Methodology',
    route: '/lens/thm',
    cta: 'Read →',
  },
  {
    slug: 'sound-money',
    title: 'From Trade to Bitcoin: The Case for Sound Money',
    description: "A six-part awareness series. Follow the thread from trade through specialization, money, debasement, and why Bitcoin is the first monetary system to fix what gold couldn't.",
    tag: '6-part series',
    route: '/lens/fiat',
    cta: 'Start series →',
  },
];
