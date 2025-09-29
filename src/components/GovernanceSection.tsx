import { motion } from "motion/react";
import { ArrowRight, Shield, Users, AlertTriangle, MessageSquare } from "lucide-react";
import { useLanguage } from "./LanguageContext";

export function GovernanceSection() {
  const { t } = useLanguage();

  const governanceAreas = [
    {
      icon: Users,
      title: "Board of Directors",
      description: "Our board is comprised of distinguished global leaders from finance, technology, and public policy, providing rigorous oversight and strategic guidance."
    },
    {
      icon: Shield,
      title: "Ethics & Compliance",
      description: "We maintain a robust framework of internal controls and compliance procedures to ensure we operate with the highest degree of integrity."
    },
    {
      icon: AlertTriangle,
      title: "Risk Management",
      description: "Our sophisticated risk management protocols are embedded in every aspect of our investment process, ensuring prudent stewardship of capital."
    },
    {
      icon: MessageSquare,
      title: "Stakeholder Engagement",
      description: "We are committed to transparency and open communication with our stakeholders, while respecting our foundational commitment to privacy and discretion."
    }
  ];

  return (
    <section id="governance" className="relative py-32 bg-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 w-full h-full opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, var(--primary) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
      </div>

      <div className="relative container mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          className="text-center max-w-4xl mx-auto mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-block px-4 py-2 bg-primary/5 rounded-full text-sm font-medium tracking-wide uppercase text-primary mb-6">
            {t('governance.subtitle')}
          </div>
          <h2 className="text-5xl lg:text-6xl font-black leading-tight text-primary mb-8">
            {t('governance.title')}
          </h2>
          <p className="text-xl text-foreground/70 leading-relaxed">
            {t('governance.description')}
          </p>
        </motion.div>

        {/* Governance Areas */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {governanceAreas.map((area, index) => (
            <motion.div
              key={area.title}
              className="group relative bg-gradient-to-br from-primary/5 to-transparent rounded-3xl p-8 border border-primary/10 hover:border-primary/20 transition-all duration-500"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <area.icon className="w-8 h-8 text-primary" />
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-primary">
                  {area.title}
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  {area.description}
                </p>
              </div>

              {/* Hover Effect */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-12 translate-x-12 group-hover:bg-primary/10 transition-colors duration-500"></div>
            </motion.div>
          ))}
        </div>

        {/* Commitment Statement */}
        <motion.div 
          className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-3xl p-12 border border-primary/20 mb-16"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="text-center max-w-4xl mx-auto">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-3xl font-black text-primary mb-6">Our Unwavering Commitment</h3>
            <p className="text-lg text-foreground/80 leading-relaxed mb-8">
              At Xhiva, corporate governance is not just a regulatory requirement—it is the cornerstone of our identity and the foundation of trust with our stakeholders. We believe that exceptional governance leads to exceptional outcomes, and we are committed to setting the highest standards in the industry.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-2xl font-black text-primary mb-2">100%</div>
                <div className="text-sm text-foreground/60 uppercase tracking-wide">Compliance Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-primary mb-2">24/7</div>
                <div className="text-sm text-foreground/60 uppercase tracking-wide">Risk Monitoring</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-primary mb-2">15+</div>
                <div className="text-sm text-foreground/60 uppercase tracking-wide">Board Members</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <button className="group bg-primary text-white px-12 py-6 rounded-3xl font-bold text-lg hover:bg-primary/90 transition-all duration-300 flex items-center space-x-3 mx-auto shadow-lg hover:shadow-xl">
            <span>{t('governance.learnMore')}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}