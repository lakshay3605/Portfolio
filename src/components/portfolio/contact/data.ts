export const CONTACT_SECTION = {
  title: 'Contact',
  ctaLabel: 'Get in Touch'
} as const;

export const CONTACT_INFO = {
  name: 'Lakshay Mahajan',
  email: 'lakshaymahajan3605@gmail.com',
  phone: {
    display: '+91 98108 83077',
    href: 'tel:+919810883077'
  },
  linkedin: {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/lakshay-mahajan-093265234'
  },
  github: {
    label: 'GitHub',
    href: 'https://github.com/lakshay3605'
  },
  location: 'Delhi, India'
} as const;

export const CONTACT_DETAILS = [
  {
    id: 'name',
    label: 'Name',
    value: CONTACT_INFO.name
  },
  {
    id: 'email',
    label: 'Email',
    value: CONTACT_INFO.email,
    href: `mailto:${CONTACT_INFO.email}`
  },
  {
    id: 'phone',
    label: 'Phone Number',
    value: CONTACT_INFO.phone.display,
    href: CONTACT_INFO.phone.href
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    value: CONTACT_INFO.linkedin.href,
    href: CONTACT_INFO.linkedin.href,
    external: true
  },
  {
    id: 'github',
    label: 'GitHub',
    value: CONTACT_INFO.github.href,
    href: CONTACT_INFO.github.href,
    external: true
  },
  {
    id: 'location',
    label: 'Location',
    value: CONTACT_INFO.location
  }
] as const;
