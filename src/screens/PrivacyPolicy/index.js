/* eslint-disable react/no-unescaped-entities */
import React, { Fragment } from 'react';
import { Linking, Text, View, StyleSheet } from 'react-native';
import HomeHeader from '@components/HomeHeader';
import { colorBlack, colorWhite } from '@constants/Colors';
import { ScrollView } from 'react-native-gesture-handler';
const PrivacyPolicy = () => {
	return (
		<Fragment>
			<HomeHeader title="Privacy Policy" />
			<View
				style={{
					flex: 1,
					padding: 20,
					backgroundColor: colorWhite,
				}}>
				<ScrollView showsVerticalScrollIndicator={false}>
					<Text style={{ alignSelf: 'center' }}>
						<Text style={{ fontSize: 20, color: colorBlack }}>
              PRIVACY POLICY
						</Text>
						{'\n'}
						{'\n'}
					</Text>

					<Text style={styles.textstyle}>
            Last updated 10th October 2021{'\n'}
						{'\n'}
            We thank you for choosing to download and use our Azzetta App
            brought to you by LA POOCHI PRIVATE LIMITED (“The Company”, "we",
            "us", "our"). As users of Azzetta (the "App"). The words "you"
            and/or your" refer to our customers/users.{'\n'}
						{'\n'}
            This Policy is to inform the users about the policies and procedures
            regarding the collection, disclosure and use of personal data
            ("Personal Data") defined below.{'\n'}
						{'\n'}
            This is part of our Terms of Service and applies to your Information
            that is collected in connection with the download, installation and
            use of the App and related services. If there are any terms in this
            privacy notice or policy that you do not agree with, please
            discontinue the use of our services and remove Azzetta from your
            device immediately.{'\n'}
						{'\n'}
						<Text style={{ fontWeight: 'bold', color: colorBlack }}>
              2.1 Definitions
						</Text>
						{'\n'}
						{'\n'}
            For the purposes of this Privacy Policy: {'\n'}
						{'\n'}Customer account means an unique account created for you to
            access our Service or parts of our Service based on authentication
            of your phone number and validated through login credentials from
            time to time when you use your account.{'\n'}
						{'\n'}
            Application (App) means the software program provided by the Company
            downloaded by you on any electronic device, named Azzetta {'\n'}
						{'\n'}Company (referred to as either "the Company", "We", "Us" or
            "Our" in this Agreement) refers to LA POOCHI PRIVATE LIMITED, Kottur
            Gardens, Chennai.{'\n'}
						{'\n'} Personal Data is any information that relates to an
            identified or identifiable individual.{'\n'}
						{'\n'} Service refers to the Application.{'\n'} Usage Data is the
            data collected automatically, either generated by the use of the
            Service or from the Service infrastructure itself. {'\n'}
						{'\n'}‘You’ refers to the individual accessing or using the Service,
            or the company, or other legal entity on behalf of which such
            individual is accessing or using the Service, as applicable.{'\n'}
						{'\n'}
						<Text style={{ fontWeight: 'bold', color: colorBlack }}>
							{' '}
              2.2 Information Collected{' '}
						</Text>
						{'\n'}
						{'\n'}All data entered by the user is called meta data and this meta
            data helps us to enable multiple information and services enabled by
            the features of our Application. The data also helps your own
            network to benefit from your ratings and recommendations similar to
            their rating or comments or recommendations provided by your network
            of users. So the data elements help us improve and customize the
            best possible services for you. The collected information may be
            uploaded to the Company's servers and/or a Service Provider's server
            or it may be simply stored on your device. We recommend that
            important documents and pictures are stored directly in DigiLocker
            provided by the Government of India for all citizens having an
            Aadhar number and associated cell phone numbers. {'\n'}
						{'\n'}
						<Text style={{ fontWeight: 'bold', color: colorBlack }}>
              2.3 Personal Information you disclose to us{' '}
						</Text>{' '}
						{'\n'}
						{'\n'}We collect personal information voluntarily provided by you to
            us when you register on the App; participate in activities on the
            App, or contact us. {'\n'}
						{'\n'}This information may include, but is not limited to: {'\n'}
						{'\n'}
						● First name and last name (you can give any
            name as desired by you as we do not validate this) {'\n'}
						{'\n'}
						● Mobile number: We send OTP through SMS for
            authentication when you register and hence required. {'\n'}
						{'\n'}
						● Email address : As email is unique for
            each user we are using this as an unique identifier in our App
            connected to the cell number instead of creating a unique customer
            or user ID as done by entities like Banks or Insurance companies.{' '}
						{'\n'}
						{'\n'}
						● Home Address: Not required until at a
            later date when you would like to avail services that depend on
            providing this to our partners to serve you. {'\n'}
						{'\n'}
						● Postal code: Our services are based on
            your location and hence it is an important data element. Our rollout
            of services is based on population and user adoption in a city and
            hence city is an important data element that our App would require
            you to choose at the time of registration. You can edit this when
            you move to another city.
						{'\n'}
						{'\n'}
						● Language Preference (when we make Azzetta
            as multilingual application){'\n'}
						{'\n'}
            All personal information provided by you need not be accurate and
            complete. It is your choice to give information as you deem
            necessary. All we would like to have is your cell number for
            registration, email as our de facto user ID that is unique in our
            system and PIN number that helps us to plan our services based on
            user concentration and to promote local businesses.{'\n'}
						{'\n'}
						<Text style={{ fontWeight: 'bold', color: colorBlack }}>
              2.4 Product Related Information{' '}
						</Text>{' '}
						{'\n'}
						{'\n'}For you to manage your Appliances and Gadgets (all other items
            of value that you use in your business or profession as an expert)
            the details of these are entered in Azzetta to help you to get
            service / warranty / AMC related reminders and recommendations or
            ratings provided by you to your network for helping others in your
            network to make informed decisions. Azzetta covers Home and Kitchen
            Appliances, Electronic Gadgets, as major categories. However there
            is an option for users to put all other equipments, professional
            tools, factory machinery or tools/ jigs etc including 2 or 4
            wheelers, cycles, etc., under the category called in Azzetta as
            “Others”.{'\n'}
						{'\n'} Azzetta Application will collect, and store all product
            related information. This includes, but is not limited to Brand,
            Type or category of product, photos or uploaded documents like
            invoice, warranty cards, AMC contracts, extended warranty documents.
            We prefer all these are actually stored in DigiLocker so that
            Azzetta is a light weight application storing very limited user data
            as absolutely required as there are so many Apps that are downloaded
            and dumped / deleted due to storage limitations of the cell phone.
						{'\n'}
						{'\n'}
						<Text style={{ fontWeight: 'bold', color: colorBlack }}>
              2.5 Information automatically collected{' '}
						</Text>
						{'\n'}
						{'\n'}We do not intend to collect any information automatically when
            you use, navigate our Application. Only when you visit the linked
            URLs or Brand websites or eCommerce or online stores, etc., to keep
            a count for commercial purposes. Also when you invite your friends
            and contact from your address book we track the number of
            invitations sent for delivering you reward coins (Azzeti coins). We
            will count when you open third party websites to get to know the
            details of display banners that you come across in Azzetta that
            offer products and services, Usage Data on our App and other
            technical information. We may request permission or access to
            certain features from your mobile device, including your mobile
            device's camera, storage, calendar, reminders, push notifications
            and other features. You can always change these in your device's
            settings.{'\n'}
						{'\n'}
						<Text style={{ fontWeight: 'bold', color: colorBlack }}>
              2.6 Third Party Service{' '}
						</Text>
						{'\n'}
						{'\n'}
            Providers We may use mobile analytical tools such as Google Firebase
            and Google Analytics for delivering our services. Any kind of
            information collected by these tools is to better understand the
            user requirements and improve their experience. These tools are
            routinely deployed by most Apps that are used by millions of users.
						{'\n'}
						{'\n'}
						<Text style={{ fontWeight: 'bold', color: colorBlack }}>
              2.7 Information Usage{' '}
						</Text>
						{'\n'}
						{'\n'}
            As the user expectations keep changing and we need to keep up with
            the same in our App and in order to achieve that at the shortest
            possible timeline we may use your usage data. This is how all Apps
            that you use enhance their functionalities and security of services
            and we intend to follow the same principles. Our terms of
            information usage will be no different from other similar Apps and
            if anything, we intend to be far less intrusive. This includes, and
            is not limited to Account creation and management; undertake
            research and analytics to improve our products/services for all
            users and particularly your network of users whom you have invited
            to use our App; data security; to contact you by telephone calls,
            SMS, mail, push notifications etc., regarding updates or
            communications related to the functionalities.{'\n'}
						{'\n'} We may disclose the available user Information as required
            pursuant to applicable laws, a directive or order of a government
            entity or statutory authority or any judicial or regulatory
            authority or to law enforcement agencies in any official
            investigation including but not limited to cyber incidents,
            prosecution and punishment of offences. We may transfer your
            data/content or any other information collected, stored, processed
            by Azzetta to any other organization or entity located in India or
            outside India, in cases where it is necessary for providing services
            to you in connection with App. {'\n'}
						{'\n'}We may share your information to third-party vendors, service
            providers, agents or contractors who perform services for us or on
            our behalf, and require access to such information to do that work.
            This is to monitor and analyse the use of our Service- for data
            analytics, understanding usage patterns, determining the
            effectiveness of our marketing and promotional campaigns; evaluate
            and improve our services and/or products, etc. This helps us to
            better understand how users are interacting with our app, and what
            can we do to improve, add/change to better serve your needs and
            interests.{'\n'}
						{'\n'}On using our App, Azzetta or any related services, you
            authorize us to contact you for any notifications and/or promotions
            in relation to our App, notwithstanding that your number may be
            registered in the respective{'\n'}
						{'\n'}
            Do not Call Registry in your jurisdiction. If you do not agree with
            any of the Terms including our Privacy Policy, you may delete your
            account by contacting us at{' '}
						<Text
							style={{ color: 'blue' }}
							onPress={() => Linking.openURL('helpdesk@azzetta.com')}>
              helpdesk@azzetta.com
						</Text>{' '}
            or stop using the App. Upon deletion of your profile/account, your
            data and any associated contents, except to the extent required to
            be retained under applicable law will be deleted from our servers.
						{'\n'}
						{'\n'}
						<Text style={{ fontWeight: 'bold', color: colorBlack }}>
							{' '}
              2.8 Security of Your Personal Data{' '}
						</Text>
						{'\n'}
						{'\n'}First of all we collect very limited personal data to deliver
            our services. We will have as much information as you choose to
            share. We do not store any financial data, bank account, credit card
            numbers that eliminates most of the concerns to any user. We have
            implemented commercially reasonable physical, operational and
            technical security measures to protect the misuse, loss or
            alteration of your data. This includes, where appropriate, the use
            of secure server facilities, firewalls, implementing proper access
            rights management systems, standard authentication and encryption
            policies for our servers and other reasonable measures. Our security
            practices and procedures limit access to personal information on a
            need-to-know basis only. {'\n'}
						{'\n'}All details of documents that you store in our App need not be
            with all digits or full as we only need very minimum details to send
            you alerts or reminders for renewal or payment due dates. All meta
            data that you enter should only be something that you understand
            well and commercial invoices of appliances and gadgets will have
            your address and telephone number for you to have access through our
            application. We do not store these uploaded photos or documents in
            our server and it is within the Azzetta. However we recommend that
            you uer Digilocker for all storage purposes and only use Azzetta to
            set due dates, purchase dates, amounts etc that is sufficient to
            make the best use of Azzetta features. This also helps to keep
            Azzetta to occupy optimal storage space in your cell phone so that
            you do not find Azzetta as a cause for running out of storage space.
						{'\n'}
						{'\n'}
						<Text style={{ fontWeight: 'bold', color: colorBlack }}>
              2.9 Data Retention
						</Text>{' '}
						{'\n'}
						{'\n'}We will retain your Personal Data only for as long as is
            necessary for the reasons set out in this Privacy Policy. We will
            retain your cell phone number, email and PIN code to the extent
            necessary to resolve issues and comply with our legal obligations.
						{'\n'}
						{'\n'}We will also retain your Usage Data for internal analysis
            purposes. This data is used to strengthen the security, or to
            improve the functionality of our service, or when we are legally
            obligated to retain this data for longer time periods. If you do not
            use our application, then the data that you had entered would be of
            no use for any purpose. But, to enable you to get back to using
            Azzetta App again, we will keep your data for 6 months, after which
            all your data will be deleted.{'\n'}
						{'\n'}
						<Text style={{ fontWeight: 'bold', color: colorBlack }}>
              2.10 Privacy Policy Review and Updates{' '}
						</Text>
						{'\n'}
						{'\n'}This privacy policy will be reviewed and updated from time to
            time. The updated version will be indicated by a "Last updated" date
            and will be effective as soon as it is accessible. {'\n'}
						{'\n'}If we make material changes to this privacy policy, we may
            notify you either by posting a notice or by directly sending you a
            notification. We encourage you to review this page periodically for
            any changes. Once posted, those changes are effective immediately.
            Continued access or use of the App {'\n'}
						{'\n'}constitutes your acceptance of the changes and the amended
            Policy. {'\n'}
						{'\n'}
						<Text style={{ fontWeight: 'bold', color: colorBlack }}>
              2.11 Links to Other Websites
						</Text>
						{'\n'}
						{'\n'}Our Services may contain links to other websites that are not
            owned or maintained by us. If you click on a third party link, you
            will be directed to that third party's site. We strongly advise you
            to review the Privacy Policy of every site you visit. We have no
            control over and assume no responsibility for the content, privacy
            policies or practices of any third-party sites or services. {'\n'}
						{'\n'}
						<Text style={{ fontWeight: 'bold', color: colorBlack }}>
              2.12 Third Party App Stores{' '}
						</Text>
						{'\n'}
						{'\n'}The App can be downloaded from third party App stores like
            Google Play, Apple App store, etc. you agree to comply with all
            third-party privacy policies (if any), applicable to the use of the
            App or related services. Azzetta shall not be responsible for your
            use of any third-party products and or service including their terms
            and conditions and or violation and infringement of any third-party
            rights, policies, in connection with access, download or
            installation of the App. {'\n'}
						{'\n'}
						<Text style={{ fontWeight: 'bold', color: colorBlack }}>
              2.13 Support{' '}
						</Text>
						{'\n'}
						{'\n'}If you have any questions or suggestions about this document,
            do not hesitate to contact us at{' '}
						<Text
							style={{ color: 'blue' }}
							onPress={() => Linking.openURL('helpdesk@azzetta.com ')}>
              helpdesk@azzetta.com
						</Text>
            . We will strive to address your feedback and concerns in a timely
            and effective manner. {'\n'}
						{'\n'}The complaints shall be redressed in the manner provided under
            the (Indian) Information Technology Act, 2000 and rules framed
            thereunder. Download Azzetta and save big! {'\n'}
						{'\n'}For more information visit our website{' '}
						<Text
							style={{ color: 'blue' }}
							onPress={() => Linking.openURL('www.azzetta.com')}>
              www.azzetta.com
						</Text>{' '}
						{'\n'}
						{'\n'}
					</Text>
				</ScrollView>
			</View>
		</Fragment>
	);
};

export default PrivacyPolicy;
const styles = StyleSheet.create({
	textstyle: {
		marginTop: 20,
		lineHeight: 24,
		fontFamily: 'Rubik-Regular',
		color: colorBlack,
	},
});
