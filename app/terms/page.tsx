import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, AlertTriangle, Shield, Scale, RefreshCw, Mail } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Aero Capital Exchange - Please read these terms carefully before using our services",
}

export default function TermsPage() {
  const lastUpdated = "January 2, 2026"

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-lg text-muted-foreground">
            Please read these terms carefully
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last Updated: {lastUpdated}
          </p>
        </div>

        <div className="space-y-8">
          {/* Acceptance */}
          <Card>
            <CardHeader>
              <FileText className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Welcome to Aero Capital Exchange. By accessing or using our website and services ("Services"), you agree to be bound by these Terms of Service ("Terms"). These Terms constitute a legally binding agreement between you and Aero Capital Exchange ("we," "us," or "our").
              </p>
              <p className="text-muted-foreground">
                If you do not agree to these Terms, you may not access or use our Services. Your continued use of our Services constitutes acceptance of these Terms and any modifications we may make from time to time.
              </p>
              <p className="text-muted-foreground">
                By using our Services, you represent and warrant that you are at least 18 years of age and have the legal capacity to enter into these Terms.
              </p>
            </CardContent>
          </Card>

          {/* Use of Service */}
          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Use of Our Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Permitted Use</h3>
                <p className="text-muted-foreground mb-2">
                  You may use our Services for lawful purposes only. You agree to use our Services in compliance with all applicable laws, regulations, and these Terms.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Prohibited Activities</h3>
                <p className="text-muted-foreground mb-2">
                  You agree not to:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Use our Services for any illegal or unauthorized purpose</li>
                  <li>Violate any laws, regulations, or third-party rights</li>
                  <li>Transmit any harmful code, viruses, or malicious software</li>
                  <li>Attempt to gain unauthorized access to our systems or networks</li>
                  <li>Interfere with or disrupt the integrity or performance of our Services</li>
                  <li>Collect or harvest information about other users without consent</li>
                  <li>Impersonate any person or entity or misrepresent your affiliation</li>
                  <li>Submit false, misleading, or fraudulent information</li>
                  <li>Use automated systems to access our Services without permission</li>
                  <li>Reproduce, duplicate, copy, or resell any part of our Services</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Account Responsibilities</h3>
                <p className="text-muted-foreground">
                  If you create an account, you are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Aircraft Listings Disclaimer */}
          <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
            <CardHeader>
              <AlertTriangle className="h-8 w-8 text-amber-600 mb-2" />
              <CardTitle>Aircraft Listings and Information Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                <strong>IMPORTANT:</strong> The aircraft listings and information provided on our website are for informational purposes only and do not constitute an offer to sell or a guarantee of availability.
              </p>
              <div>
                <h3 className="font-semibold mb-2">Accuracy of Information</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Aircraft specifications, features, and descriptions are provided by third-party sellers and sources</li>
                  <li>We strive to ensure accuracy but cannot guarantee that all information is complete, current, or error-free</li>
                  <li>Aircraft availability, pricing, and specifications are subject to change without notice</li>
                  <li>Images and photos may not represent the actual condition of the aircraft</li>
                  <li>We do not warrant the accuracy of hours, maintenance records, or aircraft history</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Due Diligence</h3>
                <p className="text-muted-foreground">
                  You are solely responsible for conducting your own due diligence, including but not limited to:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Verifying aircraft specifications and condition through independent inspection</li>
                  <li>Reviewing maintenance logs and aircraft history</li>
                  <li>Obtaining professional appraisals and surveys</li>
                  <li>Verifying registration, title, and ownership</li>
                  <li>Confirming compliance with aviation regulations</li>
                </ul>
              </div>
              <p className="text-muted-foreground font-semibold">
                We strongly recommend that you inspect any aircraft in person and engage qualified aviation professionals before making any purchase decisions.
              </p>
            </CardContent>
          </Card>

          {/* Financing Services */}
          <Card>
            <CardHeader>
              <CardTitle>Financing Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Our financing services are provided to help connect you with potential lenders. Submission of a financing application does not guarantee approval or specific terms.
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Financing is subject to credit approval and lender requirements</li>
                <li>Terms, rates, and conditions are determined by the lender, not by Aero Capital Exchange</li>
                <li>We may receive compensation from lenders for referrals</li>
                <li>You are not obligated to accept any financing offer presented to you</li>
              </ul>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle>Intellectual Property Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                All content on our website, including but not limited to text, graphics, logos, images, software, and design, is the property of Aero Capital Exchange or its licensors and is protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-muted-foreground">
                You may not reproduce, distribute, modify, create derivative works, publicly display, or otherwise use any content from our website without our prior written permission.
              </p>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardHeader>
              <Scale className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, AERO CAPITAL EXCHANGE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Loss of profits, revenue, or business opportunities</li>
                <li>Loss of data or information</li>
                <li>Business interruption or downtime</li>
                <li>Personal injury or property damage</li>
                <li>Cost of substitute goods or services</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Our total liability to you for any claims arising from your use of our Services shall not exceed the amount you have paid us in the twelve (12) months preceding the claim, or $100, whichever is greater.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg mt-4">
                <h3 className="font-semibold mb-2">Disclaimer of Warranties</h3>
                <p className="text-muted-foreground text-sm">
                  OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT OUR SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Indemnification */}
          <Card>
            <CardHeader>
              <CardTitle>Indemnification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You agree to indemnify, defend, and hold harmless Aero Capital Exchange, its officers, directors, employees, agents, and affiliates from and against any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys' fees) arising out of or related to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mt-2">
                <li>Your use of our Services</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Your breach of any representations or warranties</li>
              </ul>
            </CardContent>
          </Card>

          {/* Third-Party Links */}
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Links and Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our Services may contain links to third-party websites or services that are not owned or controlled by Aero Capital Exchange. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services. You acknowledge and agree that we shall not be liable for any damage or loss caused by your use of any third-party websites or services.
              </p>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardHeader>
              <CardTitle>Termination</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We reserve the right to terminate or suspend your access to our Services immediately, without prior notice or liability, for any reason, including but not limited to your breach of these Terms. Upon termination, your right to use our Services will immediately cease.
              </p>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle>Governing Law and Dispute Resolution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                These Terms shall be governed by and construed in accordance with the laws of the State of Florida, United States, without regard to its conflict of law provisions.
              </p>
              <p className="text-muted-foreground">
                Any disputes arising out of or relating to these Terms or our Services shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, except that either party may seek injunctive relief in court for violations of intellectual property rights.
              </p>
            </CardContent>
          </Card>

          {/* Severability */}
          <Card>
            <CardHeader>
              <CardTitle>Severability and Waiver</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect. Our failure to enforce any right or provision of these Terms shall not be deemed a waiver of such right or provision.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardHeader>
              <RefreshCw className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Changes to These Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We reserve the right to modify or replace these Terms at any time at our sole discretion. If we make material changes, we will provide notice by posting the updated Terms on our website and updating the "Last Updated" date. Your continued use of our Services after such modifications constitutes your acceptance of the updated Terms.
              </p>
              <p className="text-muted-foreground mt-4">
                We encourage you to review these Terms periodically to stay informed of any changes.
              </p>
            </CardContent>
          </Card>

          {/* Entire Agreement */}
          <Card>
            <CardHeader>
              <CardTitle>Entire Agreement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                These Terms, together with our Privacy Policy and any other legal notices published by us on our website, constitute the entire agreement between you and Aero Capital Exchange regarding your use of our Services and supersede all prior agreements and understandings.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <Mail className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                If you have questions about these Terms of Service
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-muted-foreground">
                <strong>Email:</strong>{" "}
                <a href="mailto:legal@aerocapitalexchange.com" className="text-primary hover:underline">
                  legal@aerocapitalexchange.com
                </a>
              </p>
              <p className="text-muted-foreground">
                <strong>Website:</strong>{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  Contact Form
                </Link>
              </p>
              <p className="text-muted-foreground mt-4">
                For privacy-related inquiries, please refer to our{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
