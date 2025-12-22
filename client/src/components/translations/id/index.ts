// src/translations/id/index.ts

import { commonIdTranslations } from './common';
import { homeIdTranslations } from './home';
import { aboutIdTranslations } from './about';
import { impactIdTranslations } from './impact';         
import { servicesIdTranslations } from './services';     
import { fundsIdTranslations } from './funds';           
import { partnershipsIdTranslations } from './partnerships'; 
import { strategyIdTranslations } from './strategy';       
import { careersIdTranslations } from './careers';
import { contactIdTranslations } from './contact';   
import { seoIdTranslations } from './seo';
import { taxIdTranslations } from './tax'; 
import  { faqIdTranslations } from './faq';

export const id = {
  ...commonIdTranslations,
  ...homeIdTranslations,
  ...aboutIdTranslations,
  ...impactIdTranslations,
  ...servicesIdTranslations,
  ...fundsIdTranslations,
  ...partnershipsIdTranslations,
  ...strategyIdTranslations,
  ...careersIdTranslations,
  ...contactIdTranslations,
  ...seoIdTranslations,
  ...taxIdTranslations,
  ...faqIdTranslations
};