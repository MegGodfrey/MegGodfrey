export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Terms and Privacy</h1>
        <p className="text-muted-foreground text-lg italic">Last Updated: April 20, 2026</p>
      </div>

      <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none space-y-12">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">1. Introduction</h2>
          <p>
            Welcome to StudentServe. By using our platform, you agree to these terms. StudentServe is a campus marketplace connecting students for technical services. 
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">2. User Eligibility</h2>
          <p>
            You must be a currently enrolled student with a valid university email address to use this platform. Use of non-student emails for account creation is prohibited.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">3. Marketplace Nature</h2>
          <p>
            StudentServe acts solely as a venue for students to connect. We do not employ providers, nor do we vet their technical abilities beyond verifying their student status. 
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Users are responsible for negotiating their own prices and terms of service.</li>
            <li>We recommend meeting in public campus spaces for all transactions.</li>
            <li>StudentServe is not liable for data loss, hardware damage, or financial disputes between users.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">4. Privacy Policy</h2>
          <p>
            We respect your privacy. We only collect the data necessary to provide our services:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Identity:</strong> Name, email, and profile photo from Google Auth.</li>
            <li><strong>Services:</strong> Details of the services you offer or request.</li>
            <li><strong>Feedback:</strong> Ratings and reviews given or received.</li>
          </ul>
          <p>
            We never sell your data to third parties. Your data is strictly used for platform functionality and safety.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">5. Prohibited Conduct</h2>
          <p>
            Any harassment, fraud, or illegal activity on the platform will result in an immediate and permanent account ban.
          </p>
        </section>
      </div>
    </div>
  );
}
