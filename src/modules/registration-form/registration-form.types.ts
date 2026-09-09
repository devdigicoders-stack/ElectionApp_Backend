export enum RegistrationFieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  PHONE = 'phone',
  EMAIL = 'email',
  DATE = 'date',
  SELECT = 'select',
  MULTISELECT = 'multiselect',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  PHOTO = 'photo',
  AREA_SELECTOR = 'area_selector',
}

export interface IRegistrationField {
  key: string;
  label: string;
  type: RegistrationFieldType | string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  helpText?: string;
  sortOrder: number;
  isActive: boolean;
  isSystem?: boolean;
}

export const DEFAULT_REGISTRATION_FIELDS: IRegistrationField[] = [
  {
    key: 'name',
    label: 'पूरा नाम (Full Name)',
    type: RegistrationFieldType.TEXT,
    required: true,
    sortOrder: 1,
    isSystem: true,
    isActive: true,
    placeholder: 'अपना पूरा नाम दर्ज करें',
    helpText: 'वोटर लिस्ट या आधार कार्ड के अनुसार नाम',
  },
  {
    key: 'mobile',
    label: 'मोबाइल नंबर (Mobile Number)',
    type: RegistrationFieldType.PHONE,
    required: true,
    sortOrder: 2,
    isSystem: true,
    isActive: true,
    placeholder: '10 अंकों का मोबाइल नंबर',
    helpText: 'ओटीपी सत्यापन के लिए उपयोग किया जाएगा',
  },
  {
    key: 'gender',
    label: 'लिंग (Gender)',
    type: RegistrationFieldType.SELECT,
    required: true,
    sortOrder: 3,
    isSystem: true,
    isActive: true,
    options: ['Male / पुरुष', 'Female / महिला', 'Other / अन्य'],
    placeholder: 'लिंग चुनें',
  },
  {
    key: 'dob',
    label: 'जन्म तिथि (Date of Birth)',
    type: RegistrationFieldType.DATE,
    required: false,
    sortOrder: 4,
    isSystem: true,
    isActive: true,
    placeholder: 'YYYY-MM-DD',
    helpText: 'आयु या जन्म तिथि',
  },
  {
    key: 'areaId',
    label: 'क्षेत्र / विधानसभा / वार्ड (Area / Ward)',
    type: RegistrationFieldType.AREA_SELECTOR,
    required: true,
    sortOrder: 5,
    isSystem: true,
    isActive: true,
    placeholder: 'अपना वार्ड / क्षेत्र चुनें',
    helpText: 'अपने निवास स्थान का चयन करें',
  },
  {
    key: 'voter_id',
    label: 'वोटर कार्ड संख्या (Voter ID No.)',
    type: RegistrationFieldType.TEXT,
    required: false,
    sortOrder: 6,
    isSystem: false,
    isActive: true,
    placeholder: 'उदा. ABC1234567',
    helpText: 'निर्वाचक फोटो पहचान पत्र संख्या (वैकल्पिक)',
  },
  {
    key: 'profession',
    label: 'व्यवसाय (Occupation / Profession)',
    type: RegistrationFieldType.SELECT,
    required: false,
    sortOrder: 7,
    isSystem: false,
    isActive: true,
    options: [
      'Farmer / किसान',
      'Student / छात्र',
      'Business / व्यापारी',
      'Job / नौकरी',
      'Homemaker / गृहिणी',
      'Professional / पेशेवर (डॉक्टर, वकील, आदि)',
      'Social Worker / समाजसेवी',
      'Other / अन्य',
    ],
    placeholder: 'अपना व्यवसाय चुनें',
  },
];
