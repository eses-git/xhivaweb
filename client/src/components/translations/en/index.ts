// src/translations/en/index.ts

import { commonEnTranslations } from './common';
import { homeEnTranslations } from './home';
import { aboutEnTranslations } from './about';
import { impactEnTranslations } from './impact';         
import { servicesEnTranslations } from './services';     
import { fundsEnTranslations } from './funds';           
import { partnershipsEnTranslations } from './partnerships'; 
import { strategyEnTranslations } from './strategy';       
import { careersEnTranslations } from './careers';
import { contactEnTranslations } from './contact';   
import { seoEnTranslations } from './seo';
import { taxEnTranslations } from './tax'; 
import { faqEnTranslations } from './faq';

export const en = {
  ...commonEnTranslations,
  ...homeEnTranslations,
  ...aboutEnTranslations,
  ...impactEnTranslations,
  ...servicesEnTranslations,
  ...fundsEnTranslations,
  ...partnershipsEnTranslations,
  ...strategyEnTranslations,
  ...careersEnTranslations,
  ...contactEnTranslations,
  ...seoEnTranslations,
  ...taxEnTranslations,
  ...faqEnTranslations
};