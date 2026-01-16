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
      <div className="prose prose-sm prose-slate sm:prose-base dark:prose-invert max-w-none">
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
        <div className="text-lg leading-relaxed">
          Welcome to <span className="font-medium">{APP_NAME}</span>, a service
          provided by <span className="font-medium">{COMPANY_NAME}</span>. By
          accessing or using our website at{" "}
          <Link
            href={APP_URL}
            target="_blank"
            className="text-primary hover:underline"
          >
            {APP_URL}
          </Link>
          , you agree to be bound by these Terms of Service.
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
          . Please read these Terms carefully. By using {APP_NAME}, you agree to
          these Terms. If you disagree with any part of the Terms, you may not
          access the Service.
        </div>
      </TermsSection>

      <TermsSection title="Communications" icon={<Bell className="h-6 w-6" />}>
        <div className="text-lg leading-relaxed">
          By creating an account on our Service, you agree to subscribe to
          newsletters, marketing or promotional materials, and other information
          we may send. However, you may opt out of receiving any, or all, of
          these communications from us by following the unsubscribe link or
          instructions provided in any email we send or by contacting us.
        </div>
      </TermsSection>

      <TermsSection title="Accounts" icon={<UserCog className="h-6 w-6" />}>
        <div className="space-y-4">
          <div className="text-lg leading-relaxed">
            When you create an account with us, you guarantee that the
            information you provide is accurate, complete, and current at all
            times. Inaccurate, incomplete, or obsolete information may result in
            the immediate termination of your account on the Service.
          </div>
          <div className="text-base leading-relaxed">
            You are responsible for maintaining the confidentiality of your
            account and password, including but not limited to the restriction
            of access to your computer and/or account. You agree to accept
            responsibility for any and all activities or actions that occur
            under your account and/or password.
          </div>
          <div className="text-base leading-relaxed">
            If you wish to close your account, you may do so at any time by:
          </div>
          <ul className="ml-6 list-disc space-y-2">
            <li>Using the account deletion option in your profile settings</li>
            <li>Sending an email request to {SUPPORT_EMAIL}</li>
          </ul>
        </div>
      </TermsSection>

      <TermsSection
        title="Intellectual Property"
        icon={<FileCode className="h-6 w-6" />}
      >
        <div className="text-lg leading-relaxed">
          The Service and its original content, features, and functionality are
          and will remain the exclusive property of {COMPANY_NAME} and its
          licensors. The Service is protected by copyright, trademark, and other
          laws of both the United States and foreign countries. Our trademarks
          and trade dress may not be used in connection with any product or
          service without the prior written consent of {COMPANY_NAME}.
        </div>
      </TermsSection>

      <TermsSection title="User Data" icon={<Users className="h-6 w-6" />}>
        <div className="space-y-4">
          <div className="text-lg leading-relaxed">
            You own all the data you provide to us. We only use it as described
            in our Privacy Policy. You can request deletion of your personal
            data at any time.
          </div>
          <div className="text-base leading-relaxed">
            You may request permanent deletion of your data by:
          </div>
          <ul className="ml-6 list-disc space-y-2">
            <li>Sending an email to {SUPPORT_EMAIL}</li>
            <li>Using the account deletion option in your profile settings</li>
          </ul>
          <div className="text-base leading-relaxed">
            We will process your data deletion request promptly and will confirm
            when the deletion is complete. Some information may be retained for
            legal or administrative purposes as described in our Privacy Policy.
          </div>
        </div>
      </TermsSection>

      <TermsSection
        title="Third-Party Services"
        icon={<ScrollText className="h-6 w-6" />}
      >
        <div className="space-y-4">
          <div className="text-lg leading-relaxed">
            Our Service may contain links to third-party websites or services
            that are not owned or controlled by {COMPANY_NAME}.
          </div>
          <div className="text-base leading-relaxed">
            {COMPANY_NAME} has no control over, and assumes no responsibility
            for, the content, privacy policies, or practices of any third-party
            websites or services. You acknowledge and agree that {COMPANY_NAME}{" "}
            shall not be responsible or liable, directly or indirectly, for any
            damage or loss caused or alleged to be caused by or in connection
            with the use of or reliance on any such content, goods, or services
            available on or through any such websites or services.
          </div>
          <div className="text-base leading-relaxed">
            All third parties that access your information through our Service
            are required to:
          </div>
          <ul className="ml-6 list-disc space-y-2">
            <li>Keep your information confidential</li>
            <li>
              Use your information only for the specific purpose we authorize
            </li>
            <li>Comply with our Privacy Policy</li>
            <li>
              Not use or disclose your information without active consent from
              you
            </li>
          </ul>
        </div>
      </TermsSection>

      <TermsSection
        title="Changes to Terms"
        icon={<RefreshCw className="h-6 w-6" />}
      >
        <div className="space-y-4">
          <div className="text-lg leading-relaxed">
            We may modify these Terms at any time. We will provide notice of any
            changes by:
          </div>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              Updating the &quot;Last Updated&quot; date at the top of these
              Terms
            </li>
            <li>Sending you an email notification for material changes</li>
            <li>Displaying a prominent notice on our Service</li>
          </ul>
          <div className="text-base leading-relaxed">
            Your continued use of the Service after we post modifications to the
            Terms constitutes your acknowledgment of the modifications and your
            consent to be bound by the modified Terms.
          </div>
        </div>
      </TermsSection>

      <TermsSection
        title="Limitation of Liability"
        icon={<Shield className="h-6 w-6" />}
      >
        <div className="space-y-4">
          <div className="text-lg leading-relaxed">
            In no event shall {COMPANY_NAME}, nor its directors, employees,
            partners, agents, suppliers, or affiliates, be liable for any
            indirect, incidental, special, consequential or punitive damages,
            including without limitation, loss of profits, data, use, goodwill,
            or other intangible losses, resulting from:
          </div>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              Your access to or use of or inability to access or use the Service
            </li>
            <li>Any conduct or content of any third party on the Service</li>
            <li>Any content obtained from the Service</li>
            <li>
              Unauthorized access, use, or alteration of your transmissions or
              content
            </li>
          </ul>
        </div>
      </TermsSection>

      <TermsSection title="Governing Law" icon={<Scale className="h-6 w-6" />}>
        <div className="text-lg leading-relaxed">
          These Terms shall be governed and construed in accordance with the
          laws of the United States, without regard to its conflict of law
          provisions.
        </div>
        <div className="mt-4 text-base leading-relaxed">
          Our failure to enforce any right or provision of these Terms will not
          be considered a waiver of those rights. If any provision of these
          Terms is held to be invalid or unenforceable by a court, the remaining
          provisions of these Terms will remain in effect.
        </div>
      </TermsSection>

      <TermsSection
        title="California Consumer Privacy Act (CCPA)"
        icon={<Scale className="h-6 w-6" />}
      >
        <div className="space-y-4">
          <div className="text-lg leading-relaxed">
            If you are a California resident, the California Consumer Privacy
            Act (CCPA) provides you with specific rights regarding your personal
            information.
          </div>

          <div className="text-base leading-relaxed">
            <strong>Your CCPA Rights:</strong>
          </div>

          <ul className="ml-6 list-disc space-y-2">
            <li>
              <strong>Right to Know:</strong> You have the right to request that{" "}
              {COMPANY_NAME} disclose certain information to you about our
              collection and use of your personal information over the past 12
              months.
            </li>
            <li>
              <strong>Right to Delete:</strong> You have the right to request
              that {COMPANY_NAME} delete any of your personal information that
              we have collected from you and retained, subject to certain
              exceptions.
            </li>
            <li>
              <strong>Right to Opt-Out of Sale:</strong> We do not sell personal
              information, but if we did, you would have the right to direct us
              to not sell your personal information.
            </li>
            <li>
              <strong>Right to Non-Discrimination:</strong> We will not
              discriminate against you for exercising any of your CCPA rights.
            </li>
          </ul>

          <div className="text-base leading-relaxed">
            <strong>Exercising Your Rights:</strong> To exercise your rights
            under the CCPA, please submit a verifiable consumer request to us
            by:
          </div>

          <ul className="ml-6 list-disc space-y-2">
            <li>
              Emailing us at {SUPPORT_EMAIL} with the subject line &quot;CCPA
              Request&quot;
            </li>
            <li>Using the account settings in your profile</li>
          </ul>

          <div className="text-base leading-relaxed">
            <strong>Response Timeline:</strong> We will respond to verifiable
            consumer requests within 45 days of receipt. If we require more time
            (up to an additional 45 days), we will inform you of the reason and
            extension period in writing.
          </div>
        </div>
      </TermsSection>

      <TermsSection title="Contact Us" icon={<Mail className="h-6 w-6" />}>
        <div className="space-y-6">
          <div className="text-lg">
            If you have questions about these Terms, please reach out:
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
      </TermsSection>
    </div>
  );
};

export default TermsOfService;
