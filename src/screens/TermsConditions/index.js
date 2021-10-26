/* eslint-disable react/no-unescaped-entities */
import React, { Fragment } from "react";
import { Linking, Text, View, StyleSheet } from "react-native";
import HomeHeader from "@components/HomeHeader";
import { ScrollView } from "react-native-gesture-handler";
import { colorBlack, colorWhite } from "@constants/Colors";
const TermsConditions = () => {
  return (
    <Fragment>
      <HomeHeader title="Terms and Conditions" />
      <View
        style={{
          flex: 1,
          paddingLeft: 40,
          paddingRight: 40,
          backgroundColor: colorWhite,
          // flexDirection: 'row',
          // alignItems: 'center',
          // justifyContent: 'center',
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text
            style={{ marginTop: 30, fontWeight: "bold", color: colorBlack }}>
            Azzetta (MyHomeAssets) Terms of Service
          </Text>
          <Text style={styles.textstyle}>
            Last updated 10th October 2021 These terms of service (
            <Text style={{ fontWeight: "bold" }}>Terms</Text>) govern your use
            of the Azzetta / MyHomeAssets application for mobile and handheld
            devices (<Text style={{ fontWeight: "bold" }}>Azzetta App</Text>)
            and the services (
            <Text style={{ fontWeight: "bold" }}>Services</Text>) provided
            thereunder. Please read these terms and conditions (Terms) carefully
            before you download, install, or use the Azzetta App. By clicking on
            the “I Agree” button, you signify your acceptance of the Terms, and
            your agreement to be bound by them. The Terms may be amended from
            time to time with notice to you. To continue using Azzetta App, you
            will be required to accept the revised Terms.
            {"\n"}
            {"\n"}You agree to keep the mobile or handheld device on which the
            App is installed in your possession at all times and can share it
            with or allow anyone else to use it as per your preference. All
            changes done by someone else using your access credentials will be
            assumed to be made by you. You can also login to your account in
            another mobile not belonging to you and similarly any changes or
            updates etc made by your associate is considered to be made by you.
            Azzetta App has no way of knowing if you are letting someone access
            Azzetta in your phone or that you are enlisting your family to
            update details of your assets on your behalf from their device based
            on your login credentials shared with them. You agree to allow the
            App to access the phone camera to scan the Barcode of appliances or
            gadgets to automatically update serial number and model numbers as
            defined by the manufacturer. Any errors in this update in Azzetta /
            MyHomeAssets need to be corrected manually from other references
            when required.{"\n"}
            {"\n"}
            <Text style={{ fontWeight: "bold", color: colorBlack }}>
              1. Service Overview of Azzetta
            </Text>
            {"\n"}
            {"\n"}
            The App is part of a service designed to enable registered users to
            {"\n"}
            {"\n"}
            <Text>
              (i) manage all their appliances and gadgets effectively throughout
              the lifespan of the appliances and gadgets.{"\n"}
              (ii) track the warranty end dates and access the warranty card
              when they need it though we prefer users to store all documents
              securely in Digilocker (from GOI) .{"\n"}
              (iii) get the best price for their old appliance when they decide
              to replace it as per our rollout plans for the city and on best
              efforts basis{"\n"}
              (iv) manage all documents that require renewal, payments, and
              manage ECS mandates by sending them reminders as alert(s) as per
              their own preference and choice.{".\n"}
              (v) The reminders and important dates are to be pushed into the
              native calendar of the cell phone system for easy reference and
              for taking suitable action.
            </Text>{" "}
            {"\n"}
            {"\n"}
            <Text style={{ fontWeight: "bold", color: colorBlack }}>
              2. How Azzetta Works{" "}
            </Text>
            {"\n"}
            {"\n"}
            Once the Azzetta App is installed on your mobile you are required to
            choose your primary location. Then you can enter the basic appliance
            details like Brand, Model and purchase date or month as available.
            If you have the invoice with serial number and the warranty period
            of the appliance / gadget then you can update them at the stage of
            initial onboarding or later through the edit option. You can also
            choose the location within your residence as some appliances like AC
            are there in multiple rooms. Whenever you undertake any repair or
            service to any appliance you should fill in details of the
            repair/service along with the cost of repair/service in the App. You
            may upload a scanned copy of the invoice/bill in the App. After this
            you will be able to view a dashboard of all your appliances, their
            location, the warranty dates, repairs/services done and the cost of
            ownership of each appliance.{"\n"}
            {"\n"} In case of documents, you are required to fill in the
            important information like renewal date, payment date, due date,
            etc., and the place where each document is kept. You should set up
            alerts to remind you about renewals, payments and reminders related
            to your documents (that you might have stored in DigiLocker) such as
            Passports, Visas, Driving License, Insurance, etc. {"\n"}
            {"\n"}
            <Text style={{ fontWeight: "bold", color: colorBlack }}>
              3. Premium Membership in Azzetta{" "}
            </Text>
            {".\n"}
            {"\n"}
            The App is free for managing one location, typically your home.
            There is no restriction to add multiple locations for you to manage
            your parent’s home or your second home. For our beta customers we
            hope to keep it free for the initial 3 years to ensure that you
            propagate Azzetta in your networks. If you are a professional or
            running a business and want to manage multiple locations or want to
            delegate access to your manager or employee then we want you to opt
            for premium membership. Annual fees can be paid through Azzeti coins
            also, which you can accumulate with invitations sent out and
            enlisting your first circle of friends to become users. Premium
            members get more insights of your assets to improve the life of the
            gadgets, tools and equipment etc. . {"\n"}
            {"\n"}
            <Text style={{ fontWeight: "bold", color: colorBlack }}>
              4. Trusted Reviews From Your Network of Friends And Family
            </Text>
            {"\n"}
            {"\n"}
            You get trusted recommendations, and expert opinions from your
            friends and family network who already own and manage similar
            appliances and gadgets in Azzetta App. You will get ratings of the
            sellers online or stores nearby in your city with contact details of
            the sales person for you to call and enquire about availability of
            models and price quotes of what you want to buy. You can also have
            access to ratings and comments of local businesses to help you get
            your services or products and in the process promote local
            businesses. {"\n"}
            {"\n"}
            <Text style={{ fontWeight: "bold", color: colorBlack }}>
              5. Use of Azzetta
            </Text>{" "}
            {"\n"}
            {"\n"}
            You agree that you will only use Azzetta App in good faith and will
            not provide false or misleading information about yourself or your
            assets. You agree that you will not do anything to impair the
            performance or functionality of the App. You agree that you will not
            use Azzetta App for any purpose for which it was not intended
            including, but not limited to, accessing information about
            registered users stored in the App, identifying or attempting to
            identify other registered users or gaining or attempting to gain
            access to the cloud database of the Service.{"\n"}
            {"\n"}
            <Text style={{ fontWeight: "bold", color: colorBlack }}>
              6. Azzetta Privacy Statement
            </Text>{" "}
            {"\n"}
            {"\n"}You hereby consent to the collection and use of your personal
            information for the provision of the Services. The details of the
            personal information collected and the manner in which it is
            collected and by whom as well as the purposes for which it will be
            used is more fully set out in our privacy policy which is available
            here. You can also delete Azzetta App from your mobile or handheld
            device, however, should you do so, you acknowledge that you will no
            longer be able to avail of the Services. Information that you had
            entered into Azzetta would be kept for our research and analysis
            purposes without identifying you as an individual.{"\n"}
            {"\n"}
            <Text style={{ fontWeight: "bold", color: colorBlack }}>
              7. Disruption of Service of Azzetta{" "}
            </Text>
            {"\n"}
            {"\n"}You agree that you have no expectation of, or right to
            permanent and uninterrupted access to the Services. While the
            Services are intended to be accessible to you from everywhere in
            India on a 24x7 basis, from time to time and without prior notice of
            downtime, access to the App or the Services or to any part thereof
            may be suspended on either a temporary or permanent basis and either
            with respect to all or a certain class of users. {"\n"}
            {"\n"}
            <Text style={{ fontWeight: "bold", color: colorBlack }}>
              8. Limitation of Liability
            </Text>
            {"\n"}
            {"\n"}Azzetta / MyHomeAssets will make best efforts to ensure that
            the App and the Services perform as described but will not be liable
            for (a) the failure of the App or the Services (b) the accuracy of
            the information provided by the App or the Services. Most of the
            information is entered by the user other than the overall comments
            and ratings of local business or products or services as entered by
            other users in your network. Azzetta gives the consolidated ratings
            of products and services / retailers etc as given by users in your
            network. Top recommendations with comments from the users in your
            network are shown. Do note that anyone who is in your address book
            can be added as your network even if they are not in your first
            circle. {"\n"}
            {"\n"}
            <Text style={{ fontWeight: "bold", color: colorBlack }}>
              9. Disclaimer
            </Text>
            {"\n"}
            {"\n"}The Azzetta App is being made available on an "as-is'' basis.
            All Services such as those provided by this App are never wholly
            free from defects, errors and bugs, and Azzetta / MyHomeAssets
            provides no warranty or representation to that effect or that
            Azzetta App will be compatible with any application, or software not
            specifically identified as compatible. Azzetta / MyHomeAssets
            specifically disclaims any implied warranties of fitness for a
            particular purpose or non-infringement. {"\n"}
            {"\n"}
            <Text style={{ fontWeight: "bold", color: colorBlack }}>
              10. Defect Reporting
            </Text>{" "}
            {"\n"}
            {"\n"}We are a start-up and boot strapped and would like your
            goodself to let us know any bugs or ideas you have that could
            enhance the value delivered by Azzetta. You can report any defects
            or bugs in the App or the Services to{" "}
            <Text
              style={{ color: "blue" }}
              onPress={() => Linking.openURL("support@azzetta.com")}>
              support@azzetta.com
            </Text>{" "}
            or{" "}
            <Text
              style={{ color: "blue" }}
              onPress={() => Linking.openURL("info@myhomeassets24.com")}>
              info@myhomeassets24.com
            </Text>{" "}
            Azzetta/ MyHomeAssets will make every endeavour to address all
            reported bugs and defects. We are ever grateful for your time and
            support to help Azzetta to become a leader in this category. .{" "}
            {"\n"}
            {"\n"}
            <Text style={{ fontWeight: "bold", color: colorBlack }}>
              11. Governing Law
            </Text>
            {"\n"}
            {"\n"}These Terms shall be governed by the laws of the state of
            Tamilnadu. The Azzetta App and websites
            <Text
              style={{ color: "blue" }}
              onPress={() => Linking.openURL("www.azzetta.com")}>
              www.azzetta.com
            </Text>{" "}
            and{" "}
            <Text
              style={{ color: "blue" }}
              onPress={() => Linking.openURL("www.myhomeassets.in")}>
              www.myhomeassets.in
            </Text>{" "}
            are exclusive brand names of La Poochi Private Limited a company
            incorporated under the laws of Ministry of Corporate Affairs,
            Government of India.{"\n"}
            {"\n"}
            <Text style={{ fontWeight: "bold", color: colorBlack }}>
              12. Indemnification
            </Text>{" "}
            {"\n"}
            {"\n"}
            <Text>{"\u2B24"}</Text> You agree to indemnify, defend and hold
            harmless Azzetta, its agents, affiliates, subsidiaries, channel
            partners, retailers, manufacturers of appliances / gadgets, media
            partners and each of their respective officers, directors,
            employees, successors and assigns from and against any claim,
            proceeding, damage, loss, cost, liability, demand or expense
            (including but not limited to attorney's fees) of any kind arising
            out of: {"\n"}
            <Text>{"\u{2B24}"}</Text> Your access to or use of the App, Website,
            Downloaded files and related services {"\n"}
            <Text>{"\u{2B24}"}</Text> Any breach by you of your obligations
            under this Agreement {"\n"}
            <Text>{"\u{2B24}"}</Text> Any violation of law or contractual
            obligation and any claims, demands, notices pursuant to such
            violation {"\n"}
            <Text>{"\u{2B24}"}</Text> Your negligence or wilful misconduct.
            These obligations will survive termination of this Agreement {"\n"}
            <Text>{"\u{2B24}"}</Text> Your violation of the rights of a third
            party, including but not limited to infringement of any intellectual
            property, proprietary right or trade secret of any person or entity,
            or of any privacy or consumer protection right that is implicated
            herein{"\n"}
          </Text>
        </ScrollView>
      </View>
    </Fragment>
  );
};

export default TermsConditions;
const styles = StyleSheet.create({
  textstyle: {
    marginTop: 20,
    lineHeight: 24,
    fontFamily: "Rubik-Regular",
  },
});
