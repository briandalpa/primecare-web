import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    q: 'How does pickup and delivery work?',
    a: "Simply schedule a pickup through our app. A driver will arrive at your location to collect your laundry and deliver it back once it's done.",
  },
  {
    q: 'What are your turnaround times?',
    a: 'Standard service is 48 hours. Premium and subscription plans offer 24-hour or same-day turnaround depending on the plan.',
  },
  {
    q: 'How do I track my order?',
    a: "You can track your order in real-time through the app. You'll receive status updates at every stage of the process.",
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major payment methods through Midtrans including bank transfer, credit cards, e-wallets, and QRIS.',
  },
  {
    q: 'What if my items are damaged?',
    a: "We take utmost care with every garment. In the rare event of damage, please contact our support team and we'll resolve it promptly.",
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="py-20 bg-surface">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            FAQ
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground font-heading">
            Have Any Questions?
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="bg-card border border-border rounded-xl px-5 data-[state=open]:border-primary/40"
            >
              <AccordionTrigger className="text-left text-sm font-semibold text-card-foreground hover:text-primary hover:no-underline cursor-pointer">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
