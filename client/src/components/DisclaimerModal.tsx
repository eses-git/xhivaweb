import { motion } from "motion/react";
import { X, Shield } from "lucide-react";
import { useLanguage } from "./LanguageContext";

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DisclaimerModal({ isOpen, onClose }: DisclaimerModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/90 text-white p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black">{t('disclaimer.title')}</h2>
                <p className="text-white/80 text-sm">Important Investment Information</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[60vh]">
          <div className="prose prose-sm max-w-none">
            
            {/* Main Disclaimer */}
            <div className="mb-8">
              <h3 className="text-xl font-black text-primary mb-4">Investment Disclaimer</h3>
              <p className="text-foreground/80 leading-relaxed mb-4">
                {t('disclaimer.content')}
              </p>
            </div>

            {/* Risk Warnings */}
            <div className="mb-8">
              <h3 className="text-xl font-black text-primary mb-4">Risk Warnings</h3>
              <ul className="space-y-3 text-foreground/80">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>All investments carry risk of loss, including the potential for total loss of principal.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Investment values may fluctuate significantly due to market conditions, economic factors, and geopolitical events.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Alternative investments may involve higher risks and are generally illiquid.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Currency exchange rate fluctuations may affect international investments.</span>
                </li>
              </ul>
            </div>

            {/* Eligibility */}
            <div className="mb-8">
              <h3 className="text-xl font-black text-primary mb-4">Investor Eligibility</h3>
              <p className="text-foreground/80 leading-relaxed mb-4">
                Xhiva's investment products and services are exclusively available to:
              </p>
              <ul className="space-y-2 text-foreground/80">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Qualified institutional buyers and eligible institutions</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Accredited investors meeting minimum investment thresholds</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Sovereign wealth funds and government entities</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Ultra-high-net-worth individuals subject to verification</span>
                </li>
              </ul>
            </div>

            {/* Regulatory Information */}
            <div className="mb-8">
              <h3 className="text-xl font-black text-primary mb-4">Regulatory Information</h3>
              <p className="text-foreground/80 leading-relaxed">
                Xhiva operates under the oversight of multiple regulatory authorities including the Securities and Exchange Commission (SEC), 
                Financial Conduct Authority (FCA), and Swiss Financial Market Supervisory Authority (FINMA). Our operations comply with 
                all applicable securities laws and regulations in jurisdictions where we conduct business.
              </p>
            </div>

            {/* Privacy & Confidentiality */}
            <div className="mb-8">
              <h3 className="text-xl font-black text-primary mb-4">Privacy & Confidentiality</h3>
              <p className="text-foreground/80 leading-relaxed">
                All information shared with Xhiva is treated with the highest level of confidentiality. We maintain strict data protection 
                protocols and comply with international privacy regulations including GDPR and other applicable data protection laws. 
                Client information is never shared without explicit consent except as required by law.
              </p>
            </div>

            {/* Contact for Legal Matters */}
            <div className="bg-primary/5 rounded-2xl p-6">
              <h4 className="font-bold text-primary mb-2">Legal Inquiries</h4>
              <p className="text-sm text-foreground/70">
                For questions regarding this disclaimer, compliance matters, or legal documentation, 
                please contact our legal department at legal@xhiva.com or through our secure communication channels.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 flex items-center justify-between">
          <div className="text-sm text-foreground/60">
            Last updated: December 2024
          </div>
          <button
            onClick={onClose}
            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors duration-200"
          >
            I Understand
          </button>
        </div>
      </motion.div>
    </div>
  );
}