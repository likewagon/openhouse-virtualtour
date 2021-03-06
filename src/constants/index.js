import { Alert, Linking } from 'react-native';
import {
  request, requestMultiple,
  check, checkMultiple,
  checkNotifications, requestNotifications,
  PERMISSIONS, RESULTS
} from 'react-native-permissions';

import CustomColors from './Colors';
import DefinedImages from './Images';

export const Colors = CustomColors;
export const Images = DefinedImages;

export const LoginInfo = {

}

export const RouteParam = {
  deviceType: 'phone',
  verifyResult: {},
  searchKind: '',
  propertyRecordNo: '',
  propertyAddress: '',
  agent: {},
  pdfUrl: '',
  browseUrl: '',
  openHouseIntro: {},
  liveInfo: {},
  isChanged: false,
  mapResultData: []
}

export const SearchWordData = [];

export const SearchBy = {
  query: '',
  propertyType: 1,
  categoryName: 'Single Family', //not used really for search
  listingType: 'S',
  priceFrom: 1,
  priceTo: 10000000,
  bedrooms: 1,
  bathrooms: 1,
  distance: 10,
  sortBy: 'property_price',
  sortOrder: 'asc'
}

export const PropertyTypeData = [];

export const PreferencesData = [
  {
    id: 0,
    question: 'I AM CURRENTLY LOOKING TO...',
    subquery: 'The reason why I am using this app is because I am looking to:',
    options: [
      'Buy a property',
      'Rent a property'
    ],
    answerType: 'radio',
    answerIndex: 0
  },
  {
    id: 1,
    question: 'WORKING WITH AN AGENT?',
    subquery: 'Are you currently working exclusively with a Licensed Real Estate Agent at this time?',
    options: [
      'Yes',
      'No'
    ],
    answerType: 'radio',
    answerIndex: 0
  },
  {
    id: 2,
    question: 'HOW SOON ARE YOU LOOKING TO?',
    subquery: 'How soon are you looking to buy or rent your next property?',
    options: [
      'As soon as possible',
      'Within 3 Months',
      'Within 6 Months',
      '12 Months',
      'I am not sure'
    ],
    answerType: 'radio',
    answerIndex: 0
  },
  {
    id: 3,
    question: 'I NEED A PLACE BECAUSE?',
    subquery: 'I am currently looking to buy or rent property because?',
    options: [
      'Need more space',
      'Currently Relocating',
      'Current lease will expire soon',
      'Downsizing',
      'Upsizing',
      'Affordability',
      'Other reasons'
    ],
    answerType: 'radio',
    answerIndex: 0
  },
  {
    id: 4,
    question: 'OWN OR RENT?',
    subquery: 'Do you currently own or rent a property?',
    options: [
      'Yes',
      'No'
    ],
    answerType: 'radio',
    answerIndex: 0
  },
  {
    id: 5,
    question: 'SELL OR END LEASE?',
    subquery: 'Do you need to sell your property or end your current lease before moving to your property?',
    options: [
      'Yes',
      'No'
    ],
    answerType: 'radio',
    answerIndex: 0
  },
  {
    id: 6,
    question: 'MORTGAGE QUALIFICATIONS?',
    subquery: 'I\'ve been pre-qualified by a mortgage lender within the last 60 days?',
    options: [
      'Yes',
      'No'
    ],
    answerType: 'radio',
    answerIndex: 0
  },
  {
    id: 7,
    question: 'I WOULD PREFER TO FIND A PLACE IN...',
    subquery: 'My ideal location will be near...',
    options: [
      'ANYWHERE'
    ],
    answerType: 'input',
    answerIndex: 0,
  },
  {
    id: 8,
    question: 'MY IDEAL PROPERTY WILL BE A...',
    subquery: '',
    options: [
      'Single Family Home',
      'Multi-Family Home',
      'Condominium',
      'Co-op',
      'Timeshare-Vacation Home',
      'Rental'
    ],
    answerType: 'radio',
    answerIndex: 0
  },
  {
    id: 9,
    question: 'My BUDGET IS...',
    subquery: '',
    options: [
      'NO BUDGET'
    ],
    answerType: 'input',
    answerIndex: 0,
  },
  {
    id: 10,
    question: 'BEDROOMS?',
    subquery: 'My ideal property will have this number of bedrooms',
    options: [
      '1',
      '2',
      '3',
      '4',
      '5+'
    ],
    answerType: 'radio',
    answerIndex: 0
  },
  {
    id: 11,
    question: 'BATHROOMS?',
    subquery: 'My ideal property will have this number of bathrooms',
    options: [
      '1',
      '2',
      '3',
      '4',
      '5+'
    ],
    answerType: 'radio',
    answerIndex: 0
  },
  {
    id: 12,
    question: 'PETS?',
    subquery: 'I currently own...',
    options: [
      'No Pets',
      'Small Dog(s)',
      'Large Dog(s)',
      'Cat(s)',
      'Other Animals'
    ],
    answerType: 'radio',
    answerIndex: 0
  },
  {
    id: 13,
    question: 'THE MOST IMPORTANT THING...',
    subquery: 'The most important thing for me while looking for a property is...',
    options: [
      'Location',
      'Close to shopping are',
      'Near Transportation \n (Train/Subway/Bus)',
      'Quiet Town or Neighborhood',
      'Nightlife',
      'School District',
      'Budget or Price',
      'Taxes or Additional Fees',
      'Amenities \n (Gym, Outdoor Space, Rooftop, Deck, Etc)',
      'Number of Bedrooms',
      'Number of Bathrooms',
      'Heat and Air Conditions',
      'Appliances',
      'Storage',
      'Parking',
      'Outdoor Space',
      'Pet Policy(Must Accept Pets)',
      'Security \n (Secure Location, Front Desk, Safe Town)',
      'Utilities Included (Rental Units Only)'
    ],
    answerType: 'radio',
    answerIndex: 0
  },
  {
    id: 14,
    question: 'AUTO SIGN ME INTO PROPERTIES',
    subquery: 'Please auto-sign me into every Virtual Tour or Live Open House Stream that I view',
    options: [
      'Yes',
      'No'
    ],
    answerType: 'radio',
    answerIndex: 0
  },
]

//////////// function ///////////
export const watchdogTimer = () => {
  setInterval(() => {
    //console.log('permission checking...')
    check(PERMISSIONS.IOS.CAMERA).then(
      (result) => {
        if (result != RESULTS.GRANTED) {
          //console.log('camera permission:', result);
          Linking.openSettings()
          .then(() => { })
          .catch((err) => { 
            //console.log('open setting err', err);
          })
        }
      },
    );
    check(PERMISSIONS.IOS.MICROPHONE).then(
      (result) => {
        if (result != RESULTS.GRANTED) {
          //console.log('microphone permission:', result);
          Linking.openSettings().then(() => { })
          .catch((err) => { 
            //console.log('open setting err', err);
          })
        }
      },
    );
    check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(
      (result) => {
        if (result != RESULTS.GRANTED) {
          //console.log('location permission:', result);
          Linking.openSettings()
          .then(() => { })
          .catch((err) => { 
            //console.log('open setting err', err);
          })
        }
      },
    );
    // checkNotifications().then(({ status, settings }) => {
    //   if (status != RESULTS.GRANTED) {
    //     //console.log('notification permission:', status);
    //     Linking.openSettings()
    //     .then(() => { })
    //     .catch((err) => { 
    //       //console.log('open setting err', err);
    //     })
    //   }
    // });
  }, 2000);
}