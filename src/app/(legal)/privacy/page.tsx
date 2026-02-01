import { type FC } from "react";

import type { Metadata } from "next";

import Link from "next/link";

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

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
      <div className="space-y-4 text-sm leading-relaxed sm:text-base">
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
        <p>
          Welcome to{" "}
          <span className="text-foreground font-medium">{APP_NAME}</span>. This
          Privacy Policy outlines how we collect, use, and protect your
          information when you use our Service, accessible through our website
          or related services. Your privacy is a top priority, and we are
          committed to maintaining your trust.
        </p>
        <p>
          <span className="text-foreground font-medium">{COMPANY_NAME}</span> is
          the legal entity that operates{" "}
          <Link
            href={APP_URL}
            target="_blank"
            className="text-primary hover:underline"
          >
            {APP_NAME}
          </Link>
          .
        </p>
      </PolicySection>

      <PolicySection
        title="Information We Collect"
        icon={<Info className="h-6 w-6" />}
      >
        <h3 className="text-foreground font-medium">1. Personal Data</h3>
        <p>
          While using our Service, we may ask you to provide certain personally
          identifiable information that can be used to contact or identify you.
          This may include:
        </p>
        <ul className="ml-6 list-disc space-y-1">
          <li>Email address</li>
          <li>First and last name</li>
          <li>
            Authentication information from third-party providers (e.g., Google)
          </li>
          <li>Usage data and preferences</li>
        </ul>

        <Separator className="my-6" />

        <h3 className="text-foreground font-medium">2. Usage Data</h3>
        <p>
          We may also collect information about how the Service is accessed and
          used. This Usage Data may include:
        </p>
        <ul className="ml-6 list-disc space-y-1">
          <li>
            <span className="text-foreground font-medium">
              Device Information:
            </span>{" "}
            Your computer&apos;s IP address, browser type, browser version
          </li>
          <li>
            <span className="text-foreground font-medium">
              Interaction Data:
            </span>{" "}
            The pages you visit, the time and date of your visit, the time spent
            on those pages
          </li>
          <li>
            <span className="text-foreground font-medium">
              Unique Identifiers:
            </span>{" "}
            Device identifiers and other diagnostic data
          </li>
        </ul>
      </PolicySection>

      <PolicySection
        title="Data Retention and Deletion"
        icon={<Calendar className="h-6 w-6" />}
      >
        <p>
          We retain your personal information only for as long as is necessary
          for the purposes set out in this Privacy Policy. We will retain and
          use your information to the extent necessary to comply with our legal
          obligations, resolve disputes, and enforce our policies.
        </p>

        <p>
          <span className="text-foreground font-medium">
            Your Right to Delete Your Data:
          </span>{" "}
          You have the right to request the deletion of your personal
          information from our systems. You can request permanent deletion by:
        </p>
        <ul className="ml-6 list-disc space-y-1">
          <li>
            Sending an email to {SUPPORT_EMAIL} with the subject line &quot;Data
            Deletion Request&quot;
          </li>
          <li>Using the account deletion option in your profile settings</li>
        </ul>

        <p>
          <span className="text-foreground font-medium">
            Timeframe for Deletion:
          </span>{" "}
          Upon receiving your deletion request, we will process it promptly. We
          will send you a confirmation email once the deletion is complete.
        </p>

        <p>
          <span className="text-foreground font-medium">
            Data Retention Exception:
          </span>{" "}
          Some information may be retained for legal or administrative purposes,
          such as:
        </p>
        <ul className="ml-6 list-disc space-y-1">
          <li>Records required for tax or financial reporting</li>
          <li>Information needed to detect and prevent fraud</li>
          <li>Backup information required for disaster recovery</li>
          <li>Information we are legally required to retain</li>
        </ul>

        <p>
          <span className="text-foreground font-medium">
            California Residents (CCPA):
          </span>{" "}
          If you are a California resident, you have specific rights under the
          California Consumer Privacy Act including the right to know, delete,
          opt-out of sale, and non-discrimination. Contact us at {SUPPORT_EMAIL}{" "}
          to exercise these rights.
        </p>
      </PolicySection>

      <PolicySection
        title="How We Use Your Information"
        icon={<Bell className="h-6 w-6" />}
      >
        <p>{COMPANY_NAME} uses the collected data for various purposes:</p>
        <ul className="ml-6 list-disc space-y-1">
          <li>To provide and maintain our Service</li>
          <li>To notify you about changes to our Service</li>
          <li>To allow you to participate in interactive features</li>
          <li>To provide customer support</li>
          <li>To gather analysis to improve our Service</li>
          <li>To monitor the usage of our Service</li>
          <li>To detect, prevent and address technical issues</li>
        </ul>
        <Alert variant="default" className="mt-2">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            We do not sell your personal data to third parties.
          </AlertDescription>
        </Alert>
      </PolicySection>

      <PolicySection
        title="Data Sharing and Third Parties"
        icon={<FileText className="h-6 w-6" />}
      >
        <p>
          We may share your personal information in the following situations:
        </p>
        <ul className="ml-6 list-disc space-y-1">
          <li>
            <span className="text-foreground font-medium">
              Service Providers:
            </span>{" "}
            Third-party providers who perform tasks on our behalf (payment
            processing, analytics, email delivery) are bound by contractual
            obligations to keep your information confidential.
          </li>
          <li>
            <span className="text-foreground font-medium">
              Legal Requirements:
            </span>{" "}
            We may disclose your information where required by law or in
            response to valid requests by public authorities.
          </li>
        </ul>
      </PolicySection>

      <PolicySection
        title="Cookies and Tracking"
        icon={<Cookie className="h-6 w-6" />}
      >
        <p>The Service uses cookies for:</p>
        <ul className="ml-6 list-disc space-y-1">
          <li>
            <span className="text-foreground font-medium">
              Session Management:
            </span>{" "}
            To keep you logged in
          </li>
          <li>
            <span className="text-foreground font-medium">Preferences:</span> To
            store theme and layout settings
          </li>
          <li>
            <span className="text-foreground font-medium">Authentication:</span>{" "}
            To remember your login status
          </li>
        </ul>
        <p>
          You can manage cookies via your browser settings. Note that disabling
          cookies may affect your experience.
        </p>
      </PolicySection>

      <PolicySection title="Data Security" icon={<Lock className="h-6 w-6" />}>
        <p>
          We implement industry-standard measures to protect your information,
          including:
        </p>
        <ul className="ml-6 list-disc space-y-1">
          <li>Secure transmission of data (HTTPS)</li>
          <li>Restricted access to sensitive information</li>
          <li>Regular security assessments and updates</li>
          <li>Encryption of sensitive data at rest and in transit</li>
        </ul>
        <p>
          In the event of a data breach, we will notify you via email within 72
          hours of discovery with information about the breach and
          recommendations for protecting yourself.
        </p>
      </PolicySection>

      <PolicySection
        title="Changes to This Policy"
        icon={<RefreshCw className="h-6 w-6" />}
      >
        <p>
          We may update our Privacy Policy from time to time. We will notify you
          by:
        </p>
        <ul className="ml-6 list-disc space-y-1">
          <li>Posting the new Privacy Policy on this page</li>
          <li>Updating the &quot;Last Updated&quot; date at the top</li>
          <li>Sending you an email notification for material changes</li>
        </ul>
      </PolicySection>

      <PolicySection
        title="Transfer of Business"
        icon={<RefreshCw className="h-6 w-6" />}
      >
        <p>
          If {COMPANY_NAME} is involved in a merger, acquisition, or sale of
          assets, your personal information may be transferred. We will notify
          you before your information is transferred and provide options to
          download or delete your data.
        </p>
      </PolicySection>

      <PolicySection title="Contact Us" icon={<Mail className="h-6 w-6" />}>
        <p>
          If you have questions about this Privacy Policy, please reach out:
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <Mail className="text-primary h-4 w-4" />
                <h3 className="text-foreground font-medium">Email</h3>
              </div>
              <Link
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-primary text-sm hover:underline"
              >
                {SUPPORT_EMAIL}
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <Globe className="text-primary h-4 w-4" />
                <h3 className="text-foreground font-medium">Website</h3>
              </div>
              <Link
                href={COMPANY_WEBSITE}
                target="_blank"
                className="text-primary text-sm hover:underline"
              >
                {COMPANY_WEBSITE}
              </Link>
            </CardContent>
          </Card>
        </div>
      </PolicySection>
    </div>
  );
};

export default PrivacyPolicy;
