import { type FC } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Info,
  Mail,
  Shield,
  Users,
  BookOpen,
  ScrollText,
  UserCog,
  Bell,
  FileCode,
  Scale,
  RefreshCw,
  Globe,
} from "lucide-react";
import {
  APP_NAME,
  APP_URL,
  COMPANY_NAME,
  SUPPORT_EMAIL,
  COMPANY_WEBSITE,
  TERMS_OF_SERVICE_LAST_UPDATED,
} from "@/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of Service for ${APP_NAME}. Read our terms and conditions for using the service.`,
};

interface TermsSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const TermsSection: FC<TermsSectionProps> = ({ title, icon, children }) => (
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

const TermsOfService: FC = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8 text-center sm:mb-12">
        <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Terms of Service
        </h1>
        <div className="text-muted-foreground">
          Last updated:{" "}
          <Badge variant="secondary">{TERMS_OF_SERVICE_LAST_UPDATED}</Badge>
        </div>
      </div>

      <Alert className="mb-8">
        <Info className="h-4 w-4" />
        <AlertDescription>
          Please read these Terms of Service carefully before using {APP_NAME},
          a service provided by {COMPANY_NAME}.
        </AlertDescription>
      </Alert>

      <TermsSection
        title="Introduction"
        icon={<BookOpen className="h-6 w-6" />}
      >
        <p>
          Welcome to{" "}
          <span className="text-foreground font-medium">{APP_NAME}</span>, a
          service provided by{" "}
          <span className="text-foreground font-medium">{COMPANY_NAME}</span>.
          By accessing or using our website at{" "}
          <Link
            href={APP_URL}
            target="_blank"
            className="text-primary hover:underline"
          >
            {APP_URL}
          </Link>
          , you agree to be bound by these Terms of Service.
        </p>
        <p>
          If you disagree with any part of the Terms, you may not access the
          Service.
        </p>
      </TermsSection>

      <TermsSection title="Communications" icon={<Bell className="h-6 w-6" />}>
        <p>
          By creating an account on our Service, you agree to subscribe to
          newsletters, marketing or promotional materials, and other information
          we may send. You may opt out of receiving these communications by
          following the unsubscribe link in any email we send or by contacting
          us.
        </p>
      </TermsSection>

      <TermsSection title="Accounts" icon={<UserCog className="h-6 w-6" />}>
        <p>
          When you create an account with us, you guarantee that the information
          you provide is accurate, complete, and current at all times.
          Inaccurate, incomplete, or obsolete information may result in the
          immediate termination of your account.
        </p>
        <p>
          You are responsible for maintaining the confidentiality of your
          account and password. You agree to accept responsibility for any
          activities or actions that occur under your account.
        </p>
        <p>If you wish to close your account, you may do so by:</p>
        <ul className="ml-6 list-disc space-y-1">
          <li>Using the account deletion option in your profile settings</li>
          <li>Sending an email request to {SUPPORT_EMAIL}</li>
        </ul>
      </TermsSection>

      <TermsSection
        title="Intellectual Property"
        icon={<FileCode className="h-6 w-6" />}
      >
        <p>
          The Service and its original content, features, and functionality are
          and will remain the exclusive property of {COMPANY_NAME} and its
          licensors. The Service is protected by copyright, trademark, and other
          laws. Our trademarks may not be used in connection with any product or
          service without the prior written consent of {COMPANY_NAME}.
        </p>
      </TermsSection>

      <TermsSection title="User Data" icon={<Users className="h-6 w-6" />}>
        <p>
          You own all the data you provide to us. We only use it as described in
          our Privacy Policy. You can request deletion of your personal data at
          any time by contacting {SUPPORT_EMAIL} or using the account deletion
          option in your profile settings.
        </p>
      </TermsSection>

      <TermsSection
        title="Third-Party Services"
        icon={<ScrollText className="h-6 w-6" />}
      >
        <p>
          Our Service may contain links to third-party websites or services that
          are not owned or controlled by {COMPANY_NAME}. We have no control
          over, and assume no responsibility for, the content, privacy policies,
          or practices of any third-party websites or services.
        </p>
        <p>
          All third parties that access your information through our Service are
          required to keep your information confidential and use it only for
          authorized purposes.
        </p>
      </TermsSection>

      <TermsSection
        title="Changes to Terms"
        icon={<RefreshCw className="h-6 w-6" />}
      >
        <p>We may modify these Terms at any time. We will notify you by:</p>
        <ul className="ml-6 list-disc space-y-1">
          <li>Updating the &quot;Last Updated&quot; date at the top</li>
          <li>Sending you an email notification for material changes</li>
          <li>Displaying a prominent notice on our Service</li>
        </ul>
        <p>
          Your continued use of the Service after modifications constitutes your
          acceptance of the modified Terms.
        </p>
      </TermsSection>

      <TermsSection
        title="Limitation of Liability"
        icon={<Shield className="h-6 w-6" />}
      >
        <p>
          In no event shall {COMPANY_NAME}, nor its directors, employees,
          partners, agents, suppliers, or affiliates, be liable for any
          indirect, incidental, special, consequential or punitive damages,
          including without limitation, loss of profits, data, use, goodwill, or
          other intangible losses, resulting from:
        </p>
        <ul className="ml-6 list-disc space-y-1">
          <li>Your access to or use of or inability to use the Service</li>
          <li>Any conduct or content of any third party on the Service</li>
          <li>Any content obtained from the Service</li>
          <li>
            Unauthorized access, use, or alteration of your transmissions or
            content
          </li>
        </ul>
      </TermsSection>

      <TermsSection title="Governing Law" icon={<Scale className="h-6 w-6" />}>
        <p>
          These Terms shall be governed and construed in accordance with the
          laws of the United States, without regard to its conflict of law
          provisions. Our failure to enforce any right or provision of these
          Terms will not be considered a waiver of those rights.
        </p>
      </TermsSection>

      <TermsSection
        title="California Residents (CCPA)"
        icon={<Scale className="h-6 w-6" />}
      >
        <p>
          If you are a California resident, the California Consumer Privacy Act
          (CCPA) provides you with specific rights regarding your personal
          information, including:
        </p>
        <ul className="ml-6 list-disc space-y-1">
          <li>
            <span className="text-foreground font-medium">Right to Know:</span>{" "}
            Request information about our collection and use of your personal
            information
          </li>
          <li>
            <span className="text-foreground font-medium">
              Right to Delete:
            </span>{" "}
            Request deletion of your personal information
          </li>
          <li>
            <span className="text-foreground font-medium">
              Right to Opt-Out:
            </span>{" "}
            We do not sell personal information
          </li>
          <li>
            <span className="text-foreground font-medium">
              Non-Discrimination:
            </span>{" "}
            We will not discriminate against you for exercising your rights
          </li>
        </ul>
        <p>
          To exercise your CCPA rights, email us at {SUPPORT_EMAIL} with the
          subject line &quot;CCPA Request&quot;. We will respond within 45 days.
        </p>
      </TermsSection>

      <TermsSection title="Contact Us" icon={<Mail className="h-6 w-6" />}>
        <p>If you have questions about these Terms, please reach out:</p>
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
      </TermsSection>
    </div>
  );
};

export default TermsOfService;
