// src/translations/tl/index.ts

import { commonTlTranslations } from './common';
import { homeTlTranslations } from './home';
import { aboutTlTranslations } from './about';
import { impactTlTranslations } from './impact';         
import { servicesTlTranslations } from './services';     
import { fundsTlTranslations } from './funds';           
import { partnershipsTlTranslations } from './partnerships'; 
import { strategyTlTranslations } from './strategy';       
import { careersTlTranslations } from './careers';
import { contactTlTranslations } from './contact';   
import { seoTlTranslations } from './seo';
import { taxTlTranslations } from './tax'; 
import  { faqTlTranslations } from './faq';

export const tl = {
  ...commonTlTranslations,
  ...homeTlTranslations,
  ...aboutTlTranslations,
  ...impactTlTranslations,
  ...servicesTlTranslations,
  ...fundsTlTranslations,
  ...partnershipsTlTranslations,
  ...strategyTlTranslations,
  ...careersTlTranslations,
  ...contactTlTranslations,
  ...seoTlTranslations,
  ...taxTlTranslations,
  ...faqTlTranslations
};