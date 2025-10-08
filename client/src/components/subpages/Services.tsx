// src/subpages/Funds.tsx (New file for the Funds page)
import { ServicesSection } from './ServicesSection'; // Assuming FundsSection.tsx is in the same folder
export function Services() {
  return (
    <div>
      <main>
        <ServicesSection /> {/* Render the FundsSection component here */}
      </main>
      
    </div>
  );
}