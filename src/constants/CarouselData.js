import {
  trusted_local,
  delegate,
  donate,
  trusted_reviews,
  set_alerts,
  delegate_cs,
  my_reminder,
} from '@constants/Images';
import { colorBlue } from './Colors';
// eslint-disable-next-line no-undef
export default CarouselData = [
  {
    title: 'Recommended trusted local repair shops',
    title1: 'Recommended trusted local repair shops',
    body: 'to your network and local community for improving local economy',
    img: trusted_local,
    icon: my_reminder,
    content: [
      '● Azzetta users can add their preferred service technician in their local area for specific sets of appliances or for generic skills such as electrician, carpenter, plumber, handyman etc .',
      '● Users can enter the name and contact details of local repair shops whom they use for any repairs with  ratings and comments. They can call them directly from Azzetta for any service or repair needs. ',
      '● When any user in your network is looking for a repair technician they can use Azzetta to locate the repair technician closest to their residence in their own city',
      '● You have the option to reach out to the Brand authorized service centers (numbers stored in Azzetta)  or local technicians.',
    ],
    explore: 'Explore Now',
    color: colorBlue,
  },
  {
    title: 'Delegate access to your family',
    title1: 'Delegate access to your family',
    body: 'to update any detail of appliance and help you to maintain your assets / documents.',
    img: delegate,
    content: [
      '●   Azzetta is designed for the entire family to update, maintain and plan for regular service',
      '●   Until this is enabled you can share your login credentials with your family members',
      '●   We plan to bring in Azzetta for small businesses later for multi locations',
      '●   Do share your feedback on this proposed feature at helpdesk@azzetta.com',
    ],
    icon: delegate_cs,
    explore: 'Explore Now',
    color: '#A85F7C',
  },
  {
    title: 'Donate your old \nappliances',
    title1: 'Donate your old appliances',
    body: 'to any Skill india certified traning centers nearby for imporving the learning outcome of trainees.',
    img: donate,
    icon: my_reminder,
    content: [
      '● Azzetta is partnering with NGOs and other organizations helping to train young people to become skilled technicians to service household appliances',
      '● This is towards our objective to support circular economy - Repair, Reuse, Refurbish and Resell',
      '● If you would like to donate your old appliance in working condition to a charity organization in you city then you can flag that item in Azzetta',
      '● We will be tying up with the charity organizations and Skill India supported training centres across the top 100 cities in India gradually',
      '● We need your help to identify reputed charities, resellers, service technicians and training centres in your city',
    ],
    explore: 'Explore Now',
    color: '#945A8E',
  },
  {
    title: 'Get trusted reviews from your network',
    title1: 'Get trusted reviews from your network',
    body: 'about the brand / model of appliance and also the rating of the retailers in your area.',
    img: trusted_reviews,
    icon: my_reminder,
    content: [
      '● Azzetta is an invitation only App and existing users invite their friends and family to download the app',
      '● Azzetta provides for the user to rate the brand, retailers, products and services.',
      '● These ratings would be available to all others in your network of direct contacts whom you had invited or existing users of Azzetta in your address book who are your direct first circle of users',
      '● In order to expand the numbers to get meaningful feedback we also enable you to see the ratings of those (second circle of Azzetta users) who are part of the network of your first circle',
      '● When a user want to buy any appliance or gadget they can checkout the ratings and comments before finalizing the purchase',
      '● As these ratings are from your own first circle and second circle of users it is more trust worthy and you can also reach out to those in your direct contact for additional feedback',
      '● So it is our request that all users of Azzetta take efforts to rate all assets and revisit / edit it as they become older and requires periodic service / repair before they are replaced',
    ],
    explore: 'Explore Now',
    color: '#6464A8',
  },
  {
    title: 'Set alerts for \nreminders',
    title1: 'Set alerts for reminders',
    body: 'for birthdays of family members, anniversaries and other important dates under others in My Documents',
    img: set_alerts,
    content: [
      '●   You can set your own customizable and mul',
      '●   Important dates for end of warranty, AMC, Extended Warranty, Regular Service ',
      '●   Renewal related - Passport, Driving License for self and family, etc.,',
      '●   Payment due dates - EMI, Loan, ECS, Home mortgage, Insurance premium  etc',
      '●   Any important dates in your life',
    ],
    icon: my_reminder,
    explore: 'Explore Now',
    color: '#279199',
  },
];
