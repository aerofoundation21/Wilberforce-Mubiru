export type CatalogDomain = 'graphics' | 'web-mobile';

export type GraphicsCategory = 
  | 'All Graphics'
  | 'Logo Design & CorelDRAW'
  | 'Screen Printing'
  | 'DTF (Direct-to-Film)'
  | 'Heat Press Machine'
  | 'Safety & Reflectors'
  | 'NGO Bulk Orders'
  | 'Event Merch'
  | 'Vinyl Stickers'
  | 'Eco Brand Design';

export type WebMobileCategory =
  | 'All Web & Mobile'
  | 'Web3 & MetaMask Auth'
  | 'Event Ticketing & Blockchain'
  | 'QR Passes & Gate Verification'
  | 'In-App cUSD Checkout'
  | 'Mobile UI/UX & Splash System';

export type ProjectCategory = 
  | 'All'
  | 'Web & Mobile App Development'
  | 'Logo Design & CorelDRAW'
  | 'Screen Printing'
  | 'DTF (Direct-to-Film)'
  | 'Heat Press Machine'
  | 'Safety & Reflectors'
  | 'NGO Bulk Orders'
  | 'Event Merch'
  | 'Vinyl Stickers'
  | 'Eco Brand Design'
  | GraphicsCategory
  | WebMobileCategory;

export interface ProjectItem {
  id: string;
  title: string;
  tag: ProjectCategory;
  catalog?: CatalogDomain;
  client: string;
  caption: string;
  description: string;
  img: string;
  year?: string;
  materials?: string;
  technique?: string;
  volume?: string;
  location?: string;
}

export interface QuoteRequest {
  itemType: string;
  quantity: number;
  printMethod: string;
  targetDate: string;
  organization: string;
  notes: string;
}

