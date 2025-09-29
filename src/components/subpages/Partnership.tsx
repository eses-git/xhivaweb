// src/subpages/Funds.tsx (New file for the Funds page)
import { PartnershipsSection } from './PartnershipsSection'; // Assuming FundsSection.tsx is in the same folder
export function Partnership() {
  return (
    <div>
      <main>
        <PartnershipsSection /> {/* Render the FundsSection component here */}
      </main>
      
    </div>
  );
}