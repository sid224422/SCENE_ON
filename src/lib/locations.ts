export interface CollegeOption {
  name: string
}

export interface CityOption {
  name: string
  colleges: string[]
}

export interface StateOption {
  name: string
  cities: CityOption[]
}

const notListed = 'Other / Not listed'
const notStudent = 'Not a student'

export const LOCATION_TREE: StateOption[] = [
  {
    name: 'Madhya Pradesh',
    cities: [
      {
        name: 'Bhopal',
        colleges: [
          'MANIT Bhopal',
          'IIIT Bhopal',
          'Barkatullah University',
          'LNCT University',
          notListed,
          notStudent,
        ],
      },
      {
        name: 'Indore',
        colleges: [
          'IIT Indore',
          'IIM Indore',
          'SGSITS Indore',
          'IPS Academy',
          notListed,
          notStudent,
        ],
      },
      {
        name: 'Gwalior',
        colleges: ['IIITM Gwalior', 'MITS Gwalior', notListed, notStudent],
      },
    ],
  },
  {
    name: 'Maharashtra',
    cities: [
      {
        name: 'Mumbai',
        colleges: [
          'IIT Bombay',
          'University of Mumbai',
          'NMIMS Mumbai',
          'St. Xavier’s College',
          notListed,
          notStudent,
        ],
      },
      {
        name: 'Pune',
        colleges: [
          'COEP Pune',
          'Fergusson College',
          'Symbiosis Pune',
          'PICT Pune',
          notListed,
          notStudent,
        ],
      },
      {
        name: 'Nagpur',
        colleges: ['VNIT Nagpur', 'RTMNU', notListed, notStudent],
      },
    ],
  },
  {
    name: 'Karnataka',
    cities: [
      {
        name: 'Bengaluru',
        colleges: [
          'IISc Bengaluru',
          'RV College of Engineering',
          'Christ University',
          'PES University',
          notListed,
          notStudent,
        ],
      },
      {
        name: 'Mysuru',
        colleges: ['University of Mysore', 'NIE Mysuru', notListed, notStudent],
      },
    ],
  },
  {
    name: 'Delhi',
    cities: [
      {
        name: 'New Delhi',
        colleges: [
          'IIT Delhi',
          'Delhi University',
          'JNU',
          'NSUT',
          notListed,
          notStudent,
        ],
      },
    ],
  },
  {
    name: 'Tamil Nadu',
    cities: [
      {
        name: 'Chennai',
        colleges: [
          'IIT Madras',
          'Anna University',
          'Loyola College',
          notListed,
          notStudent,
        ],
      },
      {
        name: 'Coimbatore',
        colleges: ['PSG College of Technology', 'Amrita Coimbatore', notListed, notStudent],
      },
    ],
  },
  {
    name: 'Telangana',
    cities: [
      {
        name: 'Hyderabad',
        colleges: [
          'IIT Hyderabad',
          'IIIT Hyderabad',
          'University of Hyderabad',
          notListed,
          notStudent,
        ],
      },
    ],
  },
  {
    name: 'Uttar Pradesh',
    cities: [
      {
        name: 'Lucknow',
        colleges: ['IIM Lucknow', 'University of Lucknow', notListed, notStudent],
      },
      {
        name: 'Kanpur',
        colleges: ['IIT Kanpur', 'HBTU Kanpur', notListed, notStudent],
      },
    ],
  },
  {
    name: 'West Bengal',
    cities: [
      {
        name: 'Kolkata',
        colleges: [
          'IIT Kharagpur (Kolkata campus network)',
          'Jadavpur University',
          'Presidency University',
          notListed,
          notStudent,
        ],
      },
    ],
  },
  {
    name: 'Gujarat',
    cities: [
      {
        name: 'Ahmedabad',
        colleges: ['IIM Ahmedabad', 'Nirma University', 'CEPT University', notListed, notStudent],
      },
      {
        name: 'Surat',
        colleges: ['SVNIT Surat', notListed, notStudent],
      },
    ],
  },
  {
    name: 'Rajasthan',
    cities: [
      {
        name: 'Jaipur',
        colleges: ['MNIT Jaipur', 'University of Rajasthan', notListed, notStudent],
      },
    ],
  },
]

export function getState(name: string) {
  return LOCATION_TREE.find((state) => state.name === name)
}

export function getCities(stateName: string) {
  return getState(stateName)?.cities ?? []
}

export function getColleges(stateName: string, cityName: string) {
  return getCities(stateName).find((city) => city.name === cityName)?.colleges ?? []
}
