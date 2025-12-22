// src/translations/ru/index.ts

import { commonRuTranslations } from './common';
import { homeRuTranslations } from './home';
import { aboutRuTranslations } from './about'; // Corrected from aboutEnTranslations
import { impactRuTranslations } from './impact';         
import { servicesRuTranslations } from './services';     
import { fundsRuTranslations } from './funds';           
import { partnershipsRuTranslations } from './partnerships'; 
import { strategyRuTranslations } from './strategy';       
import { careersRuTranslations } from './careers';
import { contactRuTranslations } from './contact';   
import { seoRuTranslations } from './seo';
import { taxRuTranslations } from './tax'; 
import  { faqRuTranslations } from './faq';

export const ru = {
  ...commonRuTranslations,
  ...homeRuTranslations,
  ...aboutRuTranslations,
  ...impactRuTranslations,
  ...servicesRuTranslations,
  ...fundsRuTranslations,
  ...partnershipsRuTranslations,
  ...strategyRuTranslations,
  ...careersRuTranslations,
  ...contactRuTranslations,
  ...seoRuTranslations,
  ...taxRuTranslations,
  ...faqRuTranslations
};

