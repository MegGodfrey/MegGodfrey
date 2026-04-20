import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      q: "Is StudentServe free to use?",
      a: "Browsing and posting services is free. Students negotiate their own prices. We don't take a commission yet—our goal is building the community."
    },
    {
      q: "How do I know a provider is reliable?",
      a: "Check their ratings and reviews! Each provider has a profile showing their campus expertise and feedback from other students."
    },
    {
      q: "What if my laptop gets more damaged during repair?",
      a: "StudentServe is a community marketplace. We recommend students clearly discuss risks before repairs. We are not liable for individual service outcomes."
    },
    {
      q: "How do I become a provider?",
      a: "Log in with your campus email, go to your Profile, and click 'Add Service'. You can list as many skills as you want!"
    },
    {
      q: "Where do the services take place?",
      a: "Typically on campus—in dorm common rooms, libraries, or student centers. Always meet in public or well-populated campus areas for safety."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Frequently Asked Questions</h1>
        <p className="text-xl text-muted-foreground">Everything you need to know about StudentServe.</p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, idx) => (
          <AccordionItem key={idx} value={`item-${idx}`}>
            <AccordionTrigger className="text-left font-medium">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground italic leading-relaxed">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="p-8 rounded-2xl bg-primary/5 text-center space-y-4 shadow-sm border border-primary/10">
        <h2 className="text-2xl font-bold">Still have questions?</h2>
        <p className="text-muted-foreground">Can't find the answer you're looking for? Reach out to our support team.</p>
        <div className="pt-2">
           <a href="/contact" className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
