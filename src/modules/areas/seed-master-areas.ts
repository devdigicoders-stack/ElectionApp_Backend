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
    'Ghazipur',
    'Ballia',
    'Azamgarh',
    'Pratapgarh',
    'Sultanpur',
    'Rae Bareli',
    'Agra',
    'Meerut',
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
    {
      name: 'Machhlishahr',
      code: 'PC-74',
      vidhanSabhas: [
        {
          name: 'Mariyahu',
          code: 'AC-370',
          districtName: 'Jaunpur',
          blocks: [
            {
              name: 'Mariyahu',
              code: 'BLK-MRY-JNP',
              panchayats: [
                {
                  name: 'Basadhi',
                  code: 'GP-BSD',
                  wards: [
                    { name: 'Ward A', code: 'W-01' },
                    { name: 'Ward B', code: 'W-02' },
                    { name: 'Booth 101', code: 'B-101' },
                    { name: 'Booth 102', code: 'B-102' },
                  ],
                },
                {
                  name: 'Rampur GP',
                  code: 'GP-RMP-JNP',
                  wards: [
                    { name: 'Ward 1', code: 'W-01' },
                    { name: 'Ward 2', code: 'W-02' },
                  ],
                },
                {
                  name: 'Belwa',
                  code: 'GP-BLW',
                  wards: [
                    { name: 'Ward 1', code: 'W-01' },
                  ],
                },
              ],
            },
            {
              name: 'Rampur',
              code: 'BLK-RMP-JNP',
              panchayats: [
                { name: 'Rampur Khas', code: 'GP-RKH' },
                { name: 'Koilari', code: 'GP-KLR' },
              ],
            },
            {
              name: 'Barsathi',
              code: 'BLK-BRS',
              panchayats: [
                { name: 'Barsathi Khas', code: 'GP-BRS' },
                { name: 'Bhanpur', code: 'GP-BNP' },
              ],
            },
          ],
        },
        {
          name: 'Machhlishahr (SC)',
          code: 'AC-369',
          districtName: 'Jaunpur',
          blocks: [
            { name: 'Machhlishahr', code: 'BLK-MCH' },
            { name: 'Sujanpur', code: 'BLK-SJP' },
            { name: 'Mugrabadshahpur', code: 'BLK-MGB' },
          ],
        },
        {
          name: 'Kerakat (SC)',
          code: 'AC-372',
          districtName: 'Jaunpur',
          blocks: [
            { name: 'Kerakat', code: 'BLK-KKT' },
            { name: 'Dobhi', code: 'BLK-DBH' },
            { name: 'Jalalpur', code: 'BLK-JLP' },
            { name: 'Muftiganj', code: 'BLK-MFG' },
          ],
        },
        {
          name: 'Zafrabad',
          code: 'AC-371',
          districtName: 'Jaunpur',
          blocks: [
            { name: 'Sirkoni', code: 'BLK-SRK' },
            { name: 'Dharmapur', code: 'BLK-DHM' },
            { name: 'Jalalpur', code: 'BLK-JLP' },
          ],
        },
      ],
    },
    {
      name: 'Jaunpur',
      code: 'PC-73',
      vidhanSabhas: [
        {
          name: 'Jaunpur Sadar',
          code: 'AC-366',
          districtName: 'Jaunpur',
          blocks: [
            { name: 'Jaunpur Nagar Palika', code: 'BLK-JNP-NP' },
            { name: 'Karanjakala', code: 'BLK-KJK' },
            { name: 'Sirkoni', code: 'BLK-SRK' },
          ],
        },
        {
          name: 'Malhani',
          code: 'AC-367',
          districtName: 'Jaunpur',
          blocks: [
            { name: 'Baksha', code: 'BLK-BKS' },
            { name: 'Sikrara', code: 'BLK-SKR-JNP' },
            { name: 'Karanjakala', code: 'BLK-KJK' },
          ],
        },
        {
          name: 'Badlapur',
          code: 'AC-364',
          districtName: 'Jaunpur',
          blocks: [
            { name: 'Badlapur', code: 'BLK-BDL' },
            { name: 'Maharajganj', code: 'BLK-MRJ' },
            { name: 'Baksha', code: 'BLK-BKS' },
          ],
        },
        {
          name: 'Shahganj',
          code: 'AC-365',
          districtName: 'Jaunpur',
          blocks: [
            { name: 'Shahganj', code: 'BLK-SHG-JNP' },
            { name: 'Suitha Kala', code: 'BLK-STK' },
            { name: 'Khutahan', code: 'BLK-KTH' },
          ],
        },
      ],
    },
    {
      name: 'Bhadohi',
      code: 'PC-78',
      vidhanSabhas: [
        {
          name: 'Bhadohi',
          code: 'AC-392',
          districtName: 'Bhadohi',
          blocks: [
            { name: 'Bhadohi', code: 'BLK-BDH' },
            { name: 'Suriyawan', code: 'BLK-SRY' },
          ],
        },
        {
          name: 'Gyanpur',
          code: 'AC-393',
          districtName: 'Bhadohi',
          blocks: [
            { name: 'Gyanpur', code: 'BLK-GNP' },
            { name: 'Deegh', code: 'BLK-DGH' },
          ],
        },
        {
          name: 'Aurai (SC)',
          code: 'AC-394',
          districtName: 'Bhadohi',
          blocks: [
            { name: 'Aurai', code: 'BLK-ARI' },
            { name: 'Abholi', code: 'BLK-ABH' },
          ],
        },
      ],
    },
    {
      name: 'Chandauli',
      code: 'PC-76',
      vidhanSabhas: [
        {
          name: 'Mughalsarai',
          code: 'AC-380',
          districtName: 'Chandauli',
          blocks: [
            { name: 'Niyamatabad', code: 'BLK-NYM' },
            { name: 'Chandauli Urban Zone', code: 'BLK-CHD-URB' },
          ],
        },
        {
          name: 'Sakaldiha',
          code: 'AC-381',
          districtName: 'Chandauli',
          blocks: [
            { name: 'Sakaldiha', code: 'BLK-SKD' },
            { name: 'Chahaniya', code: 'BLK-CHN' },
          ],
        },
        {
          name: 'Saiyadraja',
          code: 'AC-382',
          districtName: 'Chandauli',
          blocks: [
            { name: 'Barhani', code: 'BLK-BRH' },
            { name: 'Chandauli Sadar', code: 'BLK-CHD-SDR' },
          ],
        },
        {
          name: 'Chakia (SC)',
          code: 'AC-383',
          districtName: 'Chandauli',
          blocks: [
            { name: 'Chakia', code: 'BLK-CKA' },
            { name: 'Shahabganj', code: 'BLK-SHB' },
            { name: 'Naugarh', code: 'BLK-NGR' },
          ],
        },
      ],
    },
    {
      name: 'Ayodhya (Faizabad)',
      code: 'PC-54',
      vidhanSabhas: [
        {
          name: 'Ayodhya',
          code: 'AC-275',
          districtName: 'Ayodhya',
          blocks: [
            { name: 'Ayodhya Nagar Nigam Zone', code: 'BLK-AYD-NN' },
            { name: 'Maya Bazar', code: 'BLK-MYB' },
            { name: 'Pura Bazar', code: 'BLK-PRB' },
          ],
        },
        {
          name: 'Rudauli',
          code: 'AC-271',
          districtName: 'Ayodhya',
          blocks: [
            { name: 'Rudauli', code: 'BLK-RDL' },
            { name: 'Mawai', code: 'BLK-MWI' },
          ],
        },
        {
          name: 'Milkipur (SC)',
          code: 'AC-273',
          districtName: 'Ayodhya',
          blocks: [
            { name: 'Milkipur', code: 'BLK-MLK' },
            { name: 'Amaniganj', code: 'BLK-AMG' },
            { name: 'Harringtonganj', code: 'BLK-HRG' },
          ],
        },
        {
          name: 'Bikapur',
          code: 'AC-274',
          districtName: 'Ayodhya',
          blocks: [
            { name: 'Bikapur', code: 'BLK-BKP' },
            { name: 'Tarun', code: 'BLK-TRN' },
          ],
        },
      ],
    },
    {
      name: 'Ghazipur',
      code: 'PC-75',
      vidhanSabhas: [
        {
          name: 'Ghazipur Sadar',
          code: 'AC-375',
          districtName: 'Ghazipur',
          blocks: [
            { name: 'Ghazipur', code: 'BLK-GZP' },
            { name: 'Karanda', code: 'BLK-KRD' },
            { name: 'Virno', code: 'BLK-VRN' },
          ],
        },
        {
          name: 'Mohammadabad',
          code: 'AC-378',
          districtName: 'Ghazipur',
          blocks: [
            { name: 'Mohammadabad', code: 'BLK-MBD' },
            { name: 'Bhanwarkol', code: 'BLK-BWK' },
            { name: 'Varachawar', code: 'BLK-VRW' },
          ],
        },
        {
          name: 'Zamania',
          code: 'AC-379',
          districtName: 'Ghazipur',
          blocks: [
            { name: 'Zamania', code: 'BLK-ZMN' },
            { name: 'Reotipur', code: 'BLK-RTP' },
            { name: 'Bhadaura', code: 'BLK-BHD-GZP' },
          ],
        },
        {
          name: 'Saidpur (SC)',
          code: 'AC-374',
          districtName: 'Ghazipur',
          blocks: [
            { name: 'Saidpur', code: 'BLK-SPD' },
            { name: 'Sadat', code: 'BLK-SDT' },
            { name: 'Deokali', code: 'BLK-DKL' },
          ],
        },
        {
          name: 'Jangipur',
          code: 'AC-376',
          districtName: 'Ghazipur',
          blocks: [
            { name: 'Birno', code: 'BLK-BRN' },
            { name: 'Mardah', code: 'BLK-MRD' },
            { name: 'Kasimabad', code: 'BLK-KSM' },
          ],
        },
      ],
    },
    {
      name: 'Ballia',
      code: 'PC-72',
      vidhanSabhas: [
        {
          name: 'Ballia Nagar',
          code: 'AC-361',
          districtName: 'Ballia',
          blocks: [
            { name: 'Ballia', code: 'BLK-BLA' },
            { name: 'Dubhad', code: 'BLK-DBD' },
            { name: 'Hanumanganj', code: 'BLK-HMG' },
          ],
        },
        {
          name: 'Bairia',
          code: 'AC-363',
          districtName: 'Ballia',
          blocks: [
            { name: 'Bairia', code: 'BLK-BRA' },
            { name: 'Murli Chhapra', code: 'BLK-MCP' },
            { name: 'Belhari', code: 'BLK-BLH' },
          ],
        },
        {
          name: 'Phephana',
          code: 'AC-360',
          districtName: 'Ballia',
          blocks: [
            { name: 'Garwar', code: 'BLK-GRW' },
            { name: 'Sohaon', code: 'BLK-SHN' },
            { name: 'Chilkahar', code: 'BLK-CLK' },
          ],
        },
        {
          name: 'Rasra',
          code: 'AC-358',
          districtName: 'Ballia',
          blocks: [
            { name: 'Rasra', code: 'BLK-RSR' },
            { name: 'Nagra', code: 'BLK-NGA' },
            { name: 'Chilkahar', code: 'BLK-CLK-RSR' },
          ],
        },
        {
          name: 'Bansdih',
          code: 'AC-359',
          districtName: 'Ballia',
          blocks: [
            { name: 'Bansdih', code: 'BLK-BSD' },
            { name: 'Reoti', code: 'BLK-RTI' },
            { name: 'Beruarbari', code: 'BLK-BRB' },
          ],
        },
      ],
    },
    {
      name: 'Azamgarh',
      code: 'PC-69',
      vidhanSabhas: [
        {
          name: 'Azamgarh Sadar',
          code: 'AC-347',
          districtName: 'Azamgarh',
          blocks: [
            { name: 'Palhani', code: 'BLK-PLH' },
            { name: 'Sathiaon', code: 'BLK-STH-AZM' },
            { name: 'Jahanaganj', code: 'BLK-JHN' },
          ],
        },
        {
          name: 'Nizamabad',
          code: 'AC-348',
          districtName: 'Azamgarh',
          blocks: [
            { name: 'Rani Ki Sarai', code: 'BLK-RKS' },
            { name: 'Mirzapur Block (Azamgarh)', code: 'BLK-MZP-AZM' },
            { name: 'Tahbarpur', code: 'BLK-THB' },
          ],
        },
        {
          name: 'Phoolpur Pawai',
          code: 'AC-349',
          districtName: 'Azamgarh',
          blocks: [
            { name: 'Phoolpur', code: 'BLK-FLP' },
            { name: 'Pawai', code: 'BLK-PWI' },
            { name: 'Ahiraula', code: 'BLK-AHR' },
          ],
        },
        {
          name: 'Sagri',
          code: 'AC-345',
          districtName: 'Azamgarh',
          blocks: [
            { name: 'Bilariyaganj', code: 'BLK-BLR' },
            { name: 'Haraiya', code: 'BLK-HRY' },
            { name: 'Azmatgarh', code: 'BLK-AZM-GTH' },
          ],
        },
        {
          name: 'Mehnagar (SC)',
          code: 'AC-352',
          districtName: 'Azamgarh',
          blocks: [
            { name: 'Mehnagar', code: 'BLK-MHN' },
            { name: 'Tarwa', code: 'BLK-TRW' },
          ],
        },
      ],
    },
    {
      name: 'Pratapgarh',
      code: 'PC-39',
      vidhanSabhas: [
        {
          name: 'Pratapgarh Sadar',
          code: 'AC-248',
          districtName: 'Pratapgarh',
          blocks: [
            { name: 'Pratapgarh Sadar', code: 'BLK-PBH-SDR' },
            { name: 'Sandwa Chandika', code: 'BLK-SWC' },
            { name: 'Mandhata', code: 'BLK-MND' },
          ],
        },
        {
          name: 'Patti',
          code: 'AC-249',
          districtName: 'Pratapgarh',
          blocks: [
            { name: 'Patti', code: 'BLK-PTI' },
            { name: 'Aspur Deosara', code: 'BLK-ADS' },
            { name: 'Magraura', code: 'BLK-MGR' },
          ],
        },
        {
          name: 'Raniganj',
          code: 'AC-250',
          districtName: 'Pratapgarh',
          blocks: [
            { name: 'Gaura', code: 'BLK-GRA' },
            { name: 'Shivgarh', code: 'BLK-SVG' },
            { name: 'Baba Belkharnath Dham', code: 'BLK-BBD' },
          ],
        },
        {
          name: 'Kunda',
          code: 'AC-246',
          districtName: 'Pratapgarh',
          blocks: [
            { name: 'Kunda', code: 'BLK-KND-PBH' },
            { name: 'Babaganj', code: 'BLK-BBG' },
            { name: 'Kalakankar', code: 'BLK-KLK' },
          ],
        },
        {
          name: 'Rampur Khas',
          code: 'AC-244',
          districtName: 'Pratapgarh',
          blocks: [
            { name: 'Rampur Sangramgarh', code: 'BLK-RSG' },
            { name: 'Lalganj Ajhara', code: 'BLK-LGA' },
            { name: 'Lakshmanpur', code: 'BLK-LKP' },
          ],
        },
      ],
    },
    {
      name: 'Sultanpur',
      code: 'PC-38',
      vidhanSabhas: [
        {
          name: 'Sultanpur Sadar',
          code: 'AC-188',
          districtName: 'Sultanpur',
          blocks: [
            { name: 'Dubaldhan', code: 'BLK-DBD-SLT' },
            { name: 'Kurebhar', code: 'BLK-KRB' },
            { name: 'Dhanpatganj', code: 'BLK-DPG' },
          ],
        },
        {
          name: 'Isauli',
          code: 'AC-187',
          districtName: 'Sultanpur',
          blocks: [
            { name: 'Kurwar', code: 'BLK-KRW' },
            { name: 'Baldirai', code: 'BLK-BLD' },
          ],
        },
        {
          name: 'Kadipur (SC)',
          code: 'AC-191',
          districtName: 'Sultanpur',
          blocks: [
            { name: 'Kadipur', code: 'BLK-KDP' },
            { name: 'Akhand Nagar', code: 'BLK-AKN' },
            { name: 'Dostpur', code: 'BLK-DSP' },
          ],
        },
        {
          name: 'Lambhua',
          code: 'AC-190',
          districtName: 'Sultanpur',
          blocks: [
            { name: 'Lambhua', code: 'BLK-LBH' },
            { name: 'Motigarpur', code: 'BLK-MTG' },
            { name: 'Bhadaiya', code: 'BLK-BDY' },
          ],
        },
      ],
    },
    {
      name: 'Rae Bareli',
      code: 'PC-36',
      vidhanSabhas: [
        {
          name: 'Rae Bareli Sadar',
          code: 'AC-180',
          districtName: 'Rae Bareli',
          blocks: [
            { name: 'Rahi', code: 'BLK-RHI' },
            { name: 'Amawan', code: 'BLK-AMW' },
            { name: 'Rae Bareli Urban', code: 'BLK-RBL-URB' },
          ],
        },
        {
          name: 'Harchandpur',
          code: 'AC-179',
          districtName: 'Rae Bareli',
          blocks: [
            { name: 'Harchandpur', code: 'BLK-HCP' },
            { name: 'Sataon', code: 'BLK-STN' },
            { name: 'Khiro', code: 'BLK-KHR-RBL' },
          ],
        },
        {
          name: 'Salon (SC)',
          code: 'AC-181',
          districtName: 'Rae Bareli',
          blocks: [
            { name: 'Salon', code: 'BLK-SLN' },
            { name: 'Dih', code: 'BLK-DIH' },
            { name: 'Chhatoh', code: 'BLK-CHT-RBL' },
          ],
        },
        {
          name: 'Sareni',
          code: 'AC-182',
          districtName: 'Rae Bareli',
          blocks: [
            { name: 'Sareni', code: 'BLK-SRN' },
            { name: 'Lalganj', code: 'BLK-LLG-RBL' },
            { name: 'Dalmau', code: 'BLK-DLM' },
          ],
        },
      ],
    },
    {
      name: 'Kanpur Nagar',
      code: 'PC-43',
      vidhanSabhas: [
        {
          name: 'Sisamau',
          code: 'AC-213',
          districtName: 'Kanpur Nagar',
          blocks: [
            { name: 'Kanpur Central Urban', code: 'BLK-KNP-CTL' },
            { name: 'Kalyanpur', code: 'BLK-KLP' },
          ],
        },
        {
          name: 'Arya Nagar',
          code: 'AC-214',
          districtName: 'Kanpur Nagar',
          blocks: [
            { name: 'Kanpur Nagar Nigam Zone 1', code: 'BLK-KNP-Z1' },
          ],
        },
        {
          name: 'Kidwai Nagar',
          code: 'AC-215',
          districtName: 'Kanpur Nagar',
          blocks: [
            { name: 'Kanpur Nagar Nigam Zone 2', code: 'BLK-KNP-Z2' },
          ],
        },
        {
          name: 'Kanpur Cantt.',
          code: 'AC-216',
          districtName: 'Kanpur Nagar',
          blocks: [
            { name: 'Kanpur Cantt Board', code: 'BLK-KNP-CNT' },
            { name: 'Sarsaul', code: 'BLK-SSL' },
          ],
        },
      ],
    },
    {
      name: 'Agra',
      code: 'PC-18',
      vidhanSabhas: [
        {
          name: 'Agra Cantt. (SC)',
          code: 'AC-87',
          districtName: 'Agra',
          blocks: [
            { name: 'Agra Cantt Board', code: 'BLK-AGR-CNT' },
            { name: 'Bichpuri', code: 'BLK-BCP' },
          ],
        },
        {
          name: 'Agra South',
          code: 'AC-88',
          districtName: 'Agra',
          blocks: [
            { name: 'Agra Nagar Nigam South', code: 'BLK-AGR-STH' },
            { name: 'Barauli Ahir', code: 'BLK-BLA-AGR' },
          ],
        },
        {
          name: 'Agra North',
          code: 'AC-89',
          districtName: 'Agra',
          blocks: [
            { name: 'Agra Nagar Nigam North', code: 'BLK-AGR-NTH' },
            { name: 'Khandauli', code: 'BLK-KDL' },
          ],
        },
        {
          name: 'Fatehabad',
          code: 'AC-93',
          districtName: 'Agra',
          blocks: [
            { name: 'Fatehabad', code: 'BLK-FTB' },
            { name: 'Shamsabad', code: 'BLK-SMB' },
            { name: 'Saiyan', code: 'BLK-SYN' },
          ],
        },
      ],
    },
    {
      name: 'Meerut',
      code: 'PC-10',
      vidhanSabhas: [
        {
          name: 'Meerut City',
          code: 'AC-48',
          districtName: 'Meerut',
          blocks: [
            { name: 'Meerut Nagar Nigam Zone', code: 'BLK-MRT-NN' },
            { name: 'Rajpura', code: 'BLK-RJP' },
          ],
        },
        {
          name: 'Meerut Cantt.',
          code: 'AC-47',
          districtName: 'Meerut',
          blocks: [
            { name: 'Meerut Cantt Board', code: 'BLK-MRT-CNT' },
            { name: 'Daurala', code: 'BLK-DRL' },
          ],
        },
        {
          name: 'Sardhana',
          code: 'AC-44',
          districtName: 'Meerut',
          blocks: [
            { name: 'Sardhana', code: 'BLK-SRD' },
            { name: 'Sarurpur', code: 'BLK-SRP' },
          ],
        },
      ],
    },
  ],
};
