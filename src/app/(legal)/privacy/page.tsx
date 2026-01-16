import { type FC } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Info,
  Mail,
  Shield,
  Cookie,
  Users,
  Lock,
  Bell,
  Calendar,
  FileText,
  RefreshCw,
  Globe,
} from "lucide-react";
import {
  APP_NAME,
  APP_URL,
  COMPANY_NAME,
  SUPPORT_EMAIL,
  COMPANY_WEBSITE,
  PRIVACY_POLICY_LAST_UPDATED,
} from "@/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${APP_NAME}. Learn how we collect, use, and protect your personal information.`,
};

interface PolicySectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const PolicySection: FC<PolicySectionProps> = ({ title, icon, children }) => (
  <Card className="mb-6 sm:mb-8">
    <CardContent className="p-4 pt-4 sm:p-6 sm:pt-6">
      <div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3">
        {icon && <div className="text-primary">{icon}</div>}
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {title}
        </h2>
      </div>
      <div className="prose prose-sm prose-slate sm:prose-base dark:prose-invert max-w-none">
        {children}
      </div>
    </CardContent>
  </Card>
);

const PrivacyPolicy: FC = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8 text-center sm:mb-12">
        <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Privacy Policy
        </h1>
        <div className="text-muted-foreground">
          Last updated:{" "}
          <Badge variant="secondary">{PRIVACY_POLICY_LAST_UPDATED}</Badge>
        </div>
      </div>

      <Alert className="mb-8">
        <Info className="h-4 w-4" />
        <AlertDescription>
          At {COMPANY_NAME}, we prioritize the protection of your privacy and
          personal information. This policy outlines our commitment to
          safeguarding your data while using {APP_NAME}.
        </AlertDescription>
      </Alert>

      <PolicySection title="Introduction" icon={<Users className="h-6 w-6" />}>
        <div className="text-lg leading-relaxed">
          Welcome to <span className="font-medium">{COMPANY_NAME}</span>. This
          Privacy Policy outlines how we collect, use, and protect your
          information when you use our application,{" "}
          <span className="font-medium">{APP_NAME}</span> (the Service),
          accessible through our website or related services. Your privacy is a
          top priority, and we are committed to maintaining your trust.
        </div>
        <div className="mt-4 text-base leading-relaxed">
          <span className="font-medium">{COMPANY_NAME}</span> is the legal
          entity that operates{" "}
          <Link
            href={APP_URL}
            target="_blank"
            className="text-primary hover:underline"
          >
            {APP_NAME}
          </Link>
          .
        </div>
      </PolicySection>

      <PolicySection
        title="Information We Collect"
        icon={<Info className="h-6 w-6" />}
      >
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-xl font-medium">1. Personal Data</h3>
            <p className="mb-3 text-base">
              While using our Service, we may ask you to provide certain
              personally identifiable information that can be used to contact or
              identify you. This may include:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                <span className="font-medium">Email address</span>
              </li>
              <li>
                <span className="font-medium">First and last name</span>
              </li>
              <li>
                <span className="font-medium">
                  Authentication information from third-party providers
                </span>{" "}
                (e.g., Google)
              </li>
              <li>
                <span className="font-medium">Usage data and preferences</span>
              </li>
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="mb-3 text-xl font-medium">2. Usage Data</h3>
            <p className="mb-3 text-base">
              We may also collect information about how the Service is accessed
              and used. This Usage Data may include:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                <span className="font-medium">Device Information:</span> Your
                computer&apos;s Internet Protocol address (IP address), browser
                type, browser version
              </li>
              <li>
                <span className="font-medium">Interaction Data:</span> The pages
                of our Service that you visit, the time and date of your visit,
                the time spent on those pages
              </li>
              <li>
                <span className="font-medium">Unique Identifiers:</span> Device
                identifiers and other diagnostic data
              </li>
            </ul>
          </div>
        </div>
      </PolicySection>

      <PolicySection
        title="Data Retention and Deletion"
        icon={<Calendar className="h-6 w-6" />}
      >
        <div className="space-y-4">
          <div className="text-lg">
            We retain your personal information only for as long as is necessary
            for the purposes set out in this Privacy Policy. We will retain and
            use your information to the extent necessary to comply with our
            legal obligations, resolve disputes, and enforce our policies.
          </div>

          <div className="text-base">
            <strong>Your Right to Delete Your Data:</strong> You have the right
            to request the deletion of your personal information from our
            systems. You can request permanent deletion by:
          </div>

          <ul className="ml-6 list-disc space-y-2">
            <li>
              Sending an email to {SUPPORT_EMAIL} with the subject line
              &quot;Data Deletion Request&quot;
            </li>
            <li>
              Using the account deletion option in your profile settings
              (Profile &rarr; Account &rarr; Delete Account)
            </li>
          </ul>

          <div className="text-base">
            <strong>Timeframe for Deletion:</strong> Upon receiving your
            deletion request, we will process it promptly. We will send you a
            confirmation email once the deletion is complete.
          </div>

          <div className="text-base">
            <strong>Data Retention Exception:</strong> Some information may be
            retained for legal or administrative purposes, such as:
          </div>

          <ul className="ml-6 list-disc space-y-2">
            <li>Records required for tax or financial reporting</li>
            <li>Information needed to detect and prevent fraud</li>
            <li>Backup information required for disaster recovery</li>
            <li>Information we are legally required to retain</li>
          </ul>

          <div className="text-base font-medium">
            <strong>California Residents (CCPA Compliance):</strong> If you are
            a California resident, you have specific rights under the California
            Consumer Privacy Act (CCPA). These include:
          </div>

          <ul className="ml-6 list-disc space-y-2">
            <li>
              The right to know what personal information we collect about you
            </li>
            <li>The right to request deletion of your personal information</li>
            <li>
              The right to opt-out of the sale of your personal information
              (note: we do not sell personal information)
            </li>
            <li>
              The right to non-discrimination for exercising your CCPA rights
            </li>
          </ul>

          <div className="text-base">
            To exercise your CCPA rights, you can contact us at {SUPPORT_EMAIL}{" "}
            or use the account settings options in your profile. We will respond
            to verifiable consumer requests within 45 days of receipt, as
            required by the CCPA.
          </div>
        </div>
      </PolicySection>

      <PolicySection
        title="How We Use Your Information"
        icon={<Bell className="h-6 w-6" />}
      >
        <div className="space-y-4">
          <div className="text-lg">
            {COMPANY_NAME} uses the collected data for various purposes:
          </div>
          <ul className="ml-6 list-disc space-y-2">
            <li>To provide and maintain our Service</li>
            <li>To notify you about changes to our Service</li>
            <li>
              To allow you to participate in interactive features of our Service
            </li>
            <li>To provide customer support</li>
            <li>
              To gather analysis or valuable information so that we can improve
              our Service
            </li>
            <li>To monitor the usage of our Service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>
          <Alert variant="default" className="mt-4">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              We do not sell your personal data to third parties for monetary or
              other consideration.
            </AlertDescription>
          </Alert>
        </div>
      </PolicySection>

      <PolicySection
        title="Data Sharing and Third Parties"
        icon={<FileText className="h-6 w-6" />}
      >
        <div className="space-y-4">
          <div className="text-lg">
            We may share your personal information in the following situations:
          </div>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              <span className="font-medium">Service Providers:</span> We may
              share your information with third-party service providers to
              perform tasks on our behalf, such as payment processing, data
              analysis, email delivery, and customer service. These service
              providers are bound by contractual obligations to keep personal
              information confidential and use it only for the purposes for
              which we disclose it to them.
            </li>
            <li>
              <span className="font-medium">Legal Requirements:</span> We may
              disclose your information where required by law or in response to
              valid requests by public authorities.
            </li>
          </ul>
          <Alert variant="default" className="mt-4">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              All third parties that access your information through our Service
              are required to keep it confidential and use it only for specific
              authorized purposes.
            </AlertDescription>
          </Alert>
        </div>
      </PolicySection>

      <PolicySection
        title="Cookies and Tracking"
        icon={<Cookie className="h-6 w-6" />}
      >
        <div className="space-y-4">
          <div className="text-lg">The Service uses cookies for:</div>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              <span className="font-medium">Session Management:</span> To keep
              you logged in and secure sessions.
            </li>
            <li>
              <span className="font-medium">Preferences:</span> To store theme
              and layout settings.
            </li>
            <li>
              <span className="font-medium">Authentication:</span> To remember
              your login status and security settings.
            </li>
          </ul>
          <Alert variant="default">
            <Info className="h-4 w-4" />
            <AlertDescription>
              You can manage cookies via your browser settings. Note that
              disabling cookies may affect your experience.
            </AlertDescription>
          </Alert>
        </div>
      </PolicySection>

      <PolicySection title="Data Security" icon={<Lock className="h-6 w-6" />}>
        <div className="space-y-4">
          <div className="text-lg">
            We implement industry-standard measures to protect your information,
            including:
          </div>
          <ul className="ml-6 list-disc space-y-2">
            <li>Secure transmission of data (e.g., HTTPS).</li>
            <li>Restricted access to sensitive information.</li>
            <li>Regular security assessments and updates.</li>
            <li>Encryption of sensitive data at rest and in transit.</li>
          </ul>
          <div className="mt-4 text-base">
            In the event of a data breach that affects your personal
            information, we will notify you via email within 72 hours of
            discovery. We will provide information about the extent of the
            breach and affected data, our response, and recommendations for
            protecting yourself.
          </div>
        </div>
      </PolicySection>

      <PolicySection
        title="Changes to This Privacy Policy"
        icon={<RefreshCw className="h-6 w-6" />}
      >
        <div className="space-y-4">
          <div className="text-lg">
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by:
          </div>
          <ul className="ml-6 list-disc space-y-2">
            <li>Posting the new Privacy Policy on this page</li>
            <li>
              Updating the &quot;Last Updated&quot; date at the top of this page
            </li>
            <li>Sending you an email notification for material changes</li>
          </ul>
          <div className="mt-4 text-base">
            You are advised to review this Privacy Policy periodically for any
            changes. Changes to this Privacy Policy are effective when they are
            posted on this page.
          </div>
        </div>
      </PolicySection>

      <PolicySection
        title="Transfer of Business"
        icon={<RefreshCw className="h-6 w-6" />}
      >
        <div className="space-y-4">
          <div className="text-lg">
            If {COMPANY_NAME} is involved in a merger, acquisition, or sale of
            all or a portion of its assets, your personal information may be
            transferred as part of that transaction. In such an event, we will
            notify you before your personal information is transferred and
            becomes subject to a different Privacy Policy. You will be provided
            with the following options:
          </div>
          <ul className="ml-6 list-disc space-y-2">
            <li>Download a copy of your data</li>
            <li>Request complete deletion of your data</li>
            <li>Opt-in to the new company&apos;s Privacy Policy</li>
          </ul>
        </div>
      </PolicySection>

      <PolicySection title="Contact Us" icon={<Mail className="h-6 w-6" />}>
        <div className="space-y-6">
          <div className="text-lg">
            If you have questions about this Privacy Policy, please reach out:
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-2 flex items-center gap-2">
                  <Mail className="text-primary h-4 w-4" />
                  <h3 className="font-medium">Email</h3>
                </div>
                <Link
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="text-primary hover:underline"
                >
                  {SUPPORT_EMAIL}
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="mb-2 flex items-center gap-2">
                  <Globe className="text-primary h-4 w-4" />
                  <h3 className="font-medium">Website</h3>
                </div>
                <div className="text-muted-foreground text-sm">
                  <div className="mb-1">
                    <span className="font-medium">Company:</span> {COMPANY_NAME}
                  </div>
                  <div>
                    <span className="font-medium">Website:</span>{" "}
                    <Link
                      href={COMPANY_WEBSITE}
                      target="_blank"
                      className="text-primary hover:underline"
                    >
                      {COMPANY_WEBSITE}
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PolicySection>
    </div>
  );
};

export default PrivacyPolicy;
