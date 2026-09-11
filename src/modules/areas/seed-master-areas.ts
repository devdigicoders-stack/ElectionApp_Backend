export interface SeedWardItem {
  name: string;
  code?: string;
}

export interface SeedPanchayatItem {
  name: string;
  code?: string;
  wards?: SeedWardItem[];
}

export interface SeedBlockItem {
  name: string;
  code?: string;
  panchayats?: SeedPanchayatItem[];
}

export interface SeedVidhanSabhaItem {
  name: string;
  code?: string;
  districtName: string;
  blocks: SeedBlockItem[];
}

export interface SeedLokSabhaItem {
  name: string;
  code?: string;
  vidhanSabhas: SeedVidhanSabhaItem[];
}

export interface SeedStateItem {
  name: string;
  code: string;
  districts: string[];
  lokSabhas: SeedLokSabhaItem[];
}

export const UTTAR_PRADESH_SEED: SeedStateItem = {
  name: 'Uttar Pradesh',
  code: 'UP',
  districts: [
    'Mirzapur',
    'Varanasi',
    'Gorakhpur',
    'Prayagraj',
    'Lucknow',
    'Amethi',
    'Bhadohi',
    'Sonbhadra',
    'Chandauli',
    'Jaunpur',
    'Ayodhya',
    'Kanpur Nagar',
  ],
  lokSabhas: [
    {
      name: 'Mirzapur',
      code: 'PC-79',
      vidhanSabhas: [
        {
          name: 'Majhawan',
          code: 'AC-397',
          districtName: 'Mirzapur',
          blocks: [
            { name: 'Majhawa', code: 'BLK-MJW' },
            { name: 'Pahari', code: 'BLK-PHR' },
            { name: 'City (Mirzapur)', code: 'BLK-CTY' },
          ],
        },
        {
          name: 'Chhanbey (SC)',
          code: 'AC-395',
          districtName: 'Mirzapur',
          blocks: [
            { name: 'Chhanbey', code: 'BLK-CHB' },
            { name: 'Lalganj', code: 'BLK-LLG' },
            { name: 'Halia', code: 'BLK-HLA' },
          ],
        },
        {
          name: 'Mirzapur Sadar',
          code: 'AC-396',
          districtName: 'Mirzapur',
          blocks: [
            { name: 'City (Mirzapur)', code: 'BLK-CTY' },
            { name: 'Kon', code: 'BLK-KON' },
            { name: 'Mirzapur Urban Zone', code: 'BLK-URB-MZP' },
          ],
        },
        {
          name: 'Chunar',
          code: 'AC-398',
          districtName: 'Mirzapur',
          blocks: [
            {
              name: 'Mariyahu',
              code: 'BLK-MRY',
              panchayats: [
                {
                  name: 'Basadhi',
                  code: 'GP-BSD',
                  wards: [
                    { name: 'Ward A', code: 'W-01' },
                    { name: 'Ward B', code: 'W-02' },
                    { name: 'Booth 101', code: 'B-101' },
                  ],
                },
                {
                  name: 'Rampur',
                  code: 'GP-RMP',
                  wards: [
                    { name: 'Ward 1', code: 'W-01' },
                    { name: 'Ward 2', code: 'W-02' },
                  ],
                },
              ],
            },
            {
              name: 'Narainpur',
              code: 'BLK-NRP',
              panchayats: [
                {
                  name: 'Basadhi',
                  code: 'GP-BSD',
                  wards: [
                    { name: 'Ward A', code: 'W-01' },
                  ],
                },
                {
                  name: 'Kailahat',
                  code: 'GP-KLH',
                  wards: [
                    { name: 'Ward 1', code: 'W-01' },
                  ],
                },
              ],
            },
            { name: 'Jamalpur', code: 'BLK-JML' },
            { name: 'Sikhar', code: 'BLK-SKR' },
          ],
        },
        {
          name: 'Marihan',
          code: 'AC-399',
          districtName: 'Mirzapur',
          blocks: [
            { name: 'Marihan', code: 'BLK-MRH' },
            { name: 'Rajgarh', code: 'BLK-RJG' },
            { name: 'Pateehat', code: 'BLK-PTH' },
          ],
        },
      ],
    },
    {
      name: 'Varanasi',
      code: 'PC-77',
      vidhanSabhas: [
        {
          name: 'Rohaniya',
          code: 'AC-387',
          districtName: 'Varanasi',
          blocks: [
            { name: 'Kashi Vidyapeeth', code: 'BLK-KVP' },
            { name: 'Arajiline', code: 'BLK-ARJ' },
          ],
        },
        {
          name: 'Sevapuri',
          code: 'AC-391',
          districtName: 'Varanasi',
          blocks: [
            { name: 'Sevapuri', code: 'BLK-SVP' },
            { name: 'Arajiline', code: 'BLK-ARJ' },
          ],
        },
        {
          name: 'Varanasi Cantt.',
          code: 'AC-390',
          districtName: 'Varanasi',
          blocks: [
            { name: 'Varanasi Cantt Zone', code: 'BLK-VNS-CNT' },
            { name: 'Kashi Vidyapeeth', code: 'BLK-KVP' },
          ],
        },
        {
          name: 'Varanasi North',
          code: 'AC-388',
          districtName: 'Varanasi',
          blocks: [
            { name: 'Harahua', code: 'BLK-HRH' },
            { name: 'Varanasi City Zone North', code: 'BLK-VNS-NTH' },
          ],
        },
        {
          name: 'Varanasi South',
          code: 'AC-389',
          districtName: 'Varanasi',
          blocks: [
            { name: 'Varanasi City Zone South', code: 'BLK-VNS-STH' },
            { name: 'Kashi Vidyapeeth', code: 'BLK-KVP' },
          ],
        },
      ],
    },
    {
      name: 'Gorakhpur',
      code: 'PC-64',
      vidhanSabhas: [
        {
          name: 'Gorakhpur Urban',
          code: 'AC-322',
          districtName: 'Gorakhpur',
          blocks: [
            { name: 'Gorakhpur Nagar Nigam', code: 'BLK-GKP-NN' },
            { name: 'Chargawan', code: 'BLK-CHG' },
          ],
        },
        {
          name: 'Gorakhpur Rural',
          code: 'AC-323',
          districtName: 'Gorakhpur',
          blocks: [
            { name: 'Khorabar', code: 'BLK-KHR' },
            { name: 'Pipraich', code: 'BLK-PPR' },
            { name: 'Piprauli', code: 'BLK-PPL' },
          ],
        },
        {
          name: 'Sahjanwa',
          code: 'AC-324',
          districtName: 'Gorakhpur',
          blocks: [
            { name: 'Sahjanwa', code: 'BLK-SHJ' },
            { name: 'Pali', code: 'BLK-PLI' },
          ],
        },
        {
          name: 'Pipraich',
          code: 'AC-321',
          districtName: 'Gorakhpur',
          blocks: [
            { name: 'Pipraich', code: 'BLK-PPR' },
            { name: 'Bhathat', code: 'BLK-BHT' },
          ],
        },
      ],
    },
    {
      name: 'Lucknow',
      code: 'PC-35',
      vidhanSabhas: [
        {
          name: 'Sarojini Nagar',
          code: 'AC-170',
          districtName: 'Lucknow',
          blocks: [
            { name: 'Sarojini Nagar', code: 'BLK-SJN' },
            { name: 'Lucknow Urban Zone 8', code: 'BLK-LKO-Z8' },
          ],
        },
        {
          name: 'Lucknow Cantt.',
          code: 'AC-175',
          districtName: 'Lucknow',
          blocks: [
            { name: 'Lucknow Cantt Board', code: 'BLK-LKO-CNT' },
            { name: 'Chinhat', code: 'BLK-CHT' },
          ],
        },
        {
          name: 'Lucknow Central',
          code: 'AC-174',
          districtName: 'Lucknow',
          blocks: [
            { name: 'Lucknow Nagar Nigam Central', code: 'BLK-LKO-CTL' },
          ],
        },
        {
          name: 'Lucknow North',
          code: 'AC-172',
          districtName: 'Lucknow',
          blocks: [
            { name: 'Bakshi Ka Talab', code: 'BLK-BKT' },
            { name: 'Chinhat', code: 'BLK-CHT' },
          ],
        },
      ],
    },
    {
      name: 'Amethi',
      code: 'PC-37',
      vidhanSabhas: [
        {
          name: 'Amethi',
          code: 'AC-186',
          districtName: 'Amethi',
          blocks: [
            { name: 'Amethi', code: 'BLK-AMT' },
            { name: 'Sangrampur', code: 'BLK-SNG' },
            { name: 'Bhetua', code: 'BLK-BHT' },
          ],
        },
        {
          name: 'Gauriganj',
          code: 'AC-185',
          districtName: 'Amethi',
          blocks: [
            { name: 'Gauriganj', code: 'BLK-GRJ' },
            { name: 'Shahgarh', code: 'BLK-SHG' },
            { name: 'Jamo', code: 'BLK-JMO' },
          ],
        },
        {
          name: 'Tiloi',
          code: 'AC-178',
          districtName: 'Amethi',
          blocks: [
            { name: 'Tiloi', code: 'BLK-TLI' },
            { name: 'Singhpur', code: 'BLK-SGP' },
            { name: 'Bahadurpur', code: 'BLK-BHD' },
          ],
        },
        {
          name: 'Jagdishpur (SC)',
          code: 'AC-184',
          districtName: 'Amethi',
          blocks: [
            { name: 'Jagdishpur', code: 'BLK-JGD' },
            { name: 'Musafirkhana', code: 'BLK-MSF' },
            { name: 'Shukul Bazar', code: 'BLK-SKB' },
          ],
        },
      ],
    },
    {
      name: 'Prayagraj (Allahabad)',
      code: 'PC-52',
      vidhanSabhas: [
        {
          name: 'Allahabad West',
          code: 'AC-261',
          districtName: 'Prayagraj',
          blocks: [
            { name: 'Kandhai Madhupur / City Zone', code: 'BLK-ALD-WST' },
            { name: 'Kaurihar', code: 'BLK-KRH' },
          ],
        },
        {
          name: 'Allahabad North',
          code: 'AC-262',
          districtName: 'Prayagraj',
          blocks: [
            { name: 'Prayagraj Urban North', code: 'BLK-ALD-NTH' },
          ],
        },
        {
          name: 'Allahabad South',
          code: 'AC-263',
          districtName: 'Prayagraj',
          blocks: [
            { name: 'Prayagraj Urban South', code: 'BLK-ALD-STH' },
            { name: 'Chaka', code: 'BLK-CHK' },
          ],
        },
        
        {
          name: 'Karchhana',
          code: 'AC-260',
          districtName: 'Prayagraj',
          blocks: [
            { name: 'Karchhana', code: 'BLK-KCH' },
            { name: 'Chaka', code: 'BLK-CHK' },
            { name: 'Kaundhiyara', code: 'BLK-KND' },
          ],
        },
      ],
    },
  ],
};
