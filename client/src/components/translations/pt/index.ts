// src/translations/pt/index.ts

import { commonPtTranslations } from './common';
// This import will now work correctly
import { homePtTranslations } from './home';
import { aboutPtTranslations } from './about';
import { impactPtTranslations } from './impact';         
import { servicesPtTranslations } from './services';     
import { fundsPtTranslations } from './funds';           
import { partnershipsPtTranslations } from './partnerships'; 
import { strategyPtTranslations } from './strategy';       
import { careersPtTranslations } from './careers';
import { contactPtTranslations } from './contact';   
import { seoPtTranslations } from './seo';
import { taxPtTranslations } from './tax'; 

export const pt = {
  ...commonPtTranslations,
  ...homePtTranslations,
  ...aboutPtTranslations,
  ...impactPtTranslations,
  ...servicesPtTranslations,
  ...fundsPtTranslations,
  ...partnershipsPtTranslations,
  ...strategyPtTranslations,
  ...careersPtTranslations,
  ...contactPtTranslations,
  ...seoPtTranslations,
  ...taxPtTranslations,
};
