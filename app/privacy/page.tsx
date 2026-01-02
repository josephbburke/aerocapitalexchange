import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Lock, Cookie, Users, FileText, Mail } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Aero Capital Exchange - Learn how we collect, use, and protect your personal information",
}

export default function PrivacyPage() {
  const lastUpdated = "January 2, 2026"

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground">
            Your privacy is important to us
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last Updated: {lastUpdated}
          </p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Introduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Aero Capital Exchange ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>
              <p className="text-muted-foreground">
                By accessing or using our website, you agree to this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access the site.
              </p>
            </CardContent>
          </Card>

          {/* Information Collection */}
          <Card>
            <CardHeader>
              <Eye className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Personal Information</h3>
                <p className="text-muted-foreground mb-2">
                  We may collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Register for an account</li>
                  <li>Submit an inquiry or contact form</li>
                  <li>Request financing information</li>
                  <li>Express interest in purchasing an aircraft</li>
                  <li>Subscribe to our newsletter or communications</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Information Collected Includes:</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Name and contact information (email, phone number, address)</li>
                  <li>Company name and business information</li>
                  <li>Financial information for financing applications</li>
                  <li>Aircraft preferences and requirements</li>
                  <li>Account credentials (username, password)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Automatically Collected Information</h3>
                <p className="text-muted-foreground mb-2">
                  When you visit our website, we may automatically collect certain information about your device, including:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>IP address and browser type</li>
                  <li>Operating system and device information</li>
                  <li>Pages viewed and time spent on pages</li>
                  <li>Referring website addresses</li>
                  <li>Click-stream data and navigation patterns</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Use of Information */}
          <Card>
            <CardHeader>
              <FileText className="h-8 w-8 text-primary mb-2" />
              <CardTitle>How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-2">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Provide, operate, and maintain our services</li>
                <li>Process your inquiries and respond to your requests</li>
                <li>Evaluate and process financing applications</li>
                <li>Match you with suitable aircraft listings</li>
                <li>Send you relevant updates, offers, and promotional materials</li>
                <li>Improve our website and user experience</li>
                <li>Analyze usage trends and optimize our services</li>
                <li>Detect and prevent fraud or unauthorized activities</li>
                <li>Comply with legal obligations and enforce our terms</li>
                <li>Communicate important notices and service updates</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Protection */}
          <Card>
            <CardHeader>
              <Lock className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Data Protection and Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Secure socket layer (SSL) technology</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication procedures</li>
                <li>Employee training on data protection practices</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.
              </p>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card>
            <CardHeader>
              <Cookie className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Cookies and Tracking Technologies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are files with a small amount of data that are sent to your browser from a website and stored on your device.
              </p>
              <div>
                <h3 className="font-semibold mb-2">Types of Cookies We Use:</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li><strong>Essential Cookies:</strong> Necessary for the website to function properly</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                  <li><strong>Marketing Cookies:</strong> Track your activity to deliver relevant advertisements</li>
                </ul>
              </div>
              <p className="text-muted-foreground">
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
              </p>
            </CardContent>
          </Card>

          {/* Third Parties */}
          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Sharing with Third Parties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-2">
                We may share your information with third parties in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>
                  <strong>Service Providers:</strong> We may share your information with third-party service providers who perform services on our behalf, such as payment processing, data analysis, email delivery, and hosting services.
                </li>
                <li>
                  <strong>Financial Institutions:</strong> When you apply for financing, we may share your information with lenders and financial institutions to process your application.
                </li>
                <li>
                  <strong>Aircraft Sellers:</strong> We may share your contact information with aircraft sellers when you express interest in their listings.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose your information if required by law or in response to valid requests by public authorities.
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business.
                </li>
              </ul>
              <p className="text-muted-foreground mt-4">
                We do not sell, trade, or rent your personal information to third parties for their marketing purposes without your explicit consent.
              </p>
            </CardContent>
          </Card>

          {/* User Rights */}
          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Your Privacy Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-2">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Restriction:</strong> Request restriction of processing your information</li>
                <li><strong>Data Portability:</strong> Request transfer of your information to another service</li>
                <li><strong>Objection:</strong> Object to our processing of your information</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent where processing is based on consent</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                To exercise any of these rights, please contact us using the information provided below. We will respond to your request within a reasonable timeframe.
              </p>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle>Data Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
              </p>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us so we can delete such information.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Privacy Policy */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <Mail className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>
                If you have questions about this Privacy Policy or our privacy practices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-muted-foreground">
                <strong>Email:</strong>{" "}
                <a href="mailto:privacy@aerocapitalexchange.com" className="text-primary hover:underline">
                  privacy@aerocapitalexchange.com
                </a>
              </p>
              <p className="text-muted-foreground">
                <strong>Website:</strong>{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  Contact Form
                </Link>
              </p>
              <p className="text-muted-foreground mt-4">
                We will respond to your inquiry within 30 days.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
