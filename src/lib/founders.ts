export type FounderProfile = {
  id: string
  name: string
  title: string
  imageSrc: string
  imageAlt: string
  quote: string
}

export const FOUNDERS: FounderProfile[] = [
  {
    id: 'soorya',
    name: 'Soorya Suraweera',
    title: 'Co-Founder',
    imageSrc: '/images/founders/soorya-suraweera.jpeg',
    imageAlt: 'Portrait of Soorya Suraweera, Co-Founder of Vizualabs',
    quote:
      'Software only matters when it ships reliably and scales without drama. We build with that standard from day one — clean architecture, honest timelines, and systems our clients can trust for years.',
  },
  {
    id: 'chanuka',
    name: 'Chanuka Lankanjana',
    title: 'Co-Founder',
    imageSrc: '/images/founders/chanuka-lankanjana.jpg',
    imageAlt: 'Portrait of Chanuka Lankanjana, Co-Founder of Vizualabs',
    quote:
      'Sustainable success is never an accident. It is forged through deep integrity, relentless craft, and people who genuinely care about the details. In a fast-moving digital world, we combine that discipline with modern technology to build solutions that outlast hype and deliver real, enduring impact.',
  },
  {
    id: 'yesith',
    name: 'Yesith Sri Hansana',
    title: 'Co-Founder',
    imageSrc: '/images/founders/yesith-sri-hansana.jpg',
    imageAlt: 'Portrait of Yesith Sri Hansana, Co-Founder of Vizualabs',
    quote:
      'Momentum is earned through consistency — showing up, refining, and delivering a little more than promised. That is how Vizualabs turns complex ideas into products people actually use.',
  },
]
