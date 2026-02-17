export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  phone: string;
  email: string;
  bloodType: string;
  allergies: string[];
  conditions: string[];
  lastVisit: string;
  nextAppointment?: string;
  prescriptions: Prescription[];
  visits: Visit[];
  avatar?: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface Prescription {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'stopped';
}

export interface Visit {
  id: string;
  date: string;
  reason: string;
  diagnosis: string;
  notes: string;
  doctor: string;
  followUp?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  duration: number;
  type: 'checkup' | 'followup' | 'emergency' | 'consultation' | 'procedure';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  priority: 'normal' | 'urgent' | 'emergency';
}

export interface Reminder {
  id: string;
  patientId: string;
  patientName: string;
  type: 'sms' | 'email';
  message: string;
  scheduledAt: string;
  status: 'pending' | 'sent' | 'failed';
  appointmentId: string;
}

export const patients: Patient[] = [
  {
    id: 'P001',
    name: 'Sarah Johnson',
    age: 45,
    gender: 'Female',
    dob: '1979-03-12',
    phone: '+1 (555) 234-5678',
    email: 'sarah.johnson@email.com',
    bloodType: 'A+',
    allergies: ['Penicillin', 'Sulfa drugs'],
    conditions: ['Type 2 Diabetes', 'Hypertension'],
    lastVisit: '2025-01-28',
    nextAppointment: '2026-02-20',
    riskLevel: 'high',
    prescriptions: [
      { id: 'RX001', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', startDate: '2024-06-01', status: 'active' },
      { id: 'RX002', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', startDate: '2024-08-15', status: 'active' },
      { id: 'RX003', name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily at night', startDate: '2024-08-15', status: 'active' },
    ],
    visits: [
      { id: 'V001', date: '2025-01-28', reason: 'Routine diabetes checkup', diagnosis: 'Diabetes management review', notes: 'HbA1c at 7.2%, slightly elevated. Adjusted Metformin dosage. Blood pressure controlled at 128/82. Advised dietary improvements and 30 min daily exercise.', doctor: 'Dr. Michael Chen', followUp: '3 months' },
      { id: 'V002', date: '2024-10-15', reason: 'Blood pressure spike', diagnosis: 'Hypertensive episode', notes: 'BP recorded at 158/95. Added Lisinopril to treatment plan. ECG normal. Referred to dietitian.', doctor: 'Dr. Michael Chen' },
      { id: 'V003', date: '2024-06-20', reason: 'Annual physical', diagnosis: 'Type 2 Diabetes newly diagnosed', notes: 'Fasting glucose 182 mg/dL, HbA1c 8.1%. Started on Metformin. Diabetes education session scheduled.', doctor: 'Dr. Michael Chen' },
    ]
  },
  {
    id: 'P002',
    name: 'Robert Martinez',
    age: 62,
    gender: 'Male',
    dob: '1963-07-22',
    phone: '+1 (555) 345-6789',
    email: 'r.martinez@email.com',
    bloodType: 'O-',
    allergies: ['Aspirin'],
    conditions: ['COPD', 'Atrial Fibrillation'],
    lastVisit: '2026-02-10',
    nextAppointment: '2026-02-22',
    riskLevel: 'high',
    prescriptions: [
      { id: 'RX004', name: 'Tiotropium', dosage: '18mcg', frequency: 'Once daily inhaler', startDate: '2023-11-01', status: 'active' },
      { id: 'RX005', name: 'Warfarin', dosage: '5mg', frequency: 'Once daily', startDate: '2024-03-10', status: 'active' },
      { id: 'RX006', name: 'Albuterol', dosage: '90mcg', frequency: 'As needed', startDate: '2023-11-01', status: 'active' },
    ],
    visits: [
      { id: 'V004', date: '2026-02-10', reason: 'COPD exacerbation', diagnosis: 'Acute COPD exacerbation - moderate', notes: 'SpO2 at 91% on room air. Prescribed oral prednisone course. Increased inhaler use noted. INR 2.4 - therapeutic range. Chest X-ray shows hyperinflation consistent with COPD.', doctor: 'Dr. Lisa Park', followUp: '2 weeks' },
      { id: 'V005', date: '2025-11-30', reason: 'A-Fib monitoring', diagnosis: 'Stable atrial fibrillation', notes: 'Rhythm controlled on Warfarin. INR 2.1. Echo shows mild left atrial enlargement. Continue current management.', doctor: 'Dr. Lisa Park' },
    ]
  },
  {
    id: 'P003',
    name: 'Emily Chen',
    age: 28,
    gender: 'Female',
    dob: '1997-11-05',
    phone: '+1 (555) 456-7890',
    email: 'emily.chen@email.com',
    bloodType: 'B+',
    allergies: [],
    conditions: ['Asthma', 'Anxiety disorder'],
    lastVisit: '2026-01-15',
    nextAppointment: '2026-02-19',
    riskLevel: 'medium',
    prescriptions: [
      { id: 'RX007', name: 'Fluticasone', dosage: '110mcg', frequency: 'Twice daily inhaler', startDate: '2022-05-20', status: 'active' },
      { id: 'RX008', name: 'Sertraline', dosage: '50mg', frequency: 'Once daily', startDate: '2024-09-01', status: 'active' },
    ],
    visits: [
      { id: 'V006', date: '2026-01-15', reason: 'Anxiety management', diagnosis: 'Generalized anxiety disorder - improving', notes: 'Patient reports improved sleep and reduced panic episodes. GAD-7 score: 8 (down from 14). Continue Sertraline 50mg. Therapy referral accepted.', doctor: 'Dr. James Wilson', followUp: '6 weeks' },
      { id: 'V007', date: '2025-09-10', reason: 'Asthma review', diagnosis: 'Mild persistent asthma - controlled', notes: 'Lung function FEV1 82% predicted. Good inhaler technique. No nighttime symptoms. Continue maintenance therapy.', doctor: 'Dr. James Wilson' },
    ]
  },
  {
    id: 'P004',
    name: 'David Thompson',
    age: 55,
    gender: 'Male',
    dob: '1970-09-18',
    phone: '+1 (555) 567-8901',
    email: 'd.thompson@email.com',
    bloodType: 'AB+',
    allergies: ['Codeine', 'Latex'],
    conditions: ['Osteoarthritis', 'High Cholesterol'],
    lastVisit: '2026-02-05',
    nextAppointment: '2026-02-21',
    riskLevel: 'medium',
    prescriptions: [
      { id: 'RX009', name: 'Naproxen', dosage: '500mg', frequency: 'Twice daily with food', startDate: '2025-08-01', status: 'active' },
      { id: 'RX010', name: 'Rosuvastatin', dosage: '10mg', frequency: 'Once daily', startDate: '2025-01-15', status: 'active' },
    ],
    visits: [
      { id: 'V008', date: '2026-02-05', reason: 'Joint pain follow-up', diagnosis: 'Bilateral knee osteoarthritis progression', notes: 'Patient reports 6/10 pain with walking > 1 block. X-ray shows moderate joint space narrowing. Referred to orthopedics for evaluation. PT exercises prescribed.', doctor: 'Dr. Michael Chen', followUp: '4 weeks' },
    ]
  },
  {
    id: 'P005',
    name: 'Maria Rodriguez',
    age: 33,
    gender: 'Female',
    dob: '1992-04-25',
    phone: '+1 (555) 678-9012',
    email: 'm.rodriguez@email.com',
    bloodType: 'A-',
    allergies: [],
    conditions: ['Migraine', 'Iron deficiency anemia'],
    lastVisit: '2026-02-12',
    nextAppointment: '2026-02-24',
    riskLevel: 'low',
    prescriptions: [
      { id: 'RX011', name: 'Sumatriptan', dosage: '50mg', frequency: 'As needed for migraines', startDate: '2024-02-01', status: 'active' },
      { id: 'RX012', name: 'Ferrous sulfate', dosage: '325mg', frequency: 'Once daily', startDate: '2026-01-10', status: 'active' },
    ],
    visits: [
      { id: 'V009', date: '2026-02-12', reason: 'Fatigue and headaches', diagnosis: 'Iron deficiency anemia, migraine headaches', notes: 'Hgb 9.8 g/dL, ferritin 6 ng/mL. Started on iron supplementation. Migraine frequency 2x/month, well-controlled with triptans. Repeat CBC in 8 weeks.', doctor: 'Dr. Lisa Park', followUp: '8 weeks' },
    ]
  },
];

export const appointments: Appointment[] = [
  { id: 'A001', patientId: 'P003', patientName: 'Emily Chen', date: '2026-02-17', time: '09:00', duration: 30, type: 'followup', status: 'scheduled', notes: 'Anxiety management follow-up', priority: 'normal' },
  { id: 'A002', patientId: 'P004', patientName: 'David Thompson', date: '2026-02-17', time: '09:30', duration: 45, type: 'followup', status: 'scheduled', notes: 'Orthopedics referral discussion', priority: 'normal' },
  { id: 'A003', patientId: 'P001', patientName: 'Sarah Johnson', date: '2026-02-17', time: '10:30', duration: 30, type: 'checkup', status: 'scheduled', notes: 'Diabetes quarterly checkup', priority: 'normal' },
  { id: 'A004', patientId: 'P002', patientName: 'Robert Martinez', date: '2026-02-17', time: '11:15', duration: 45, type: 'followup', status: 'scheduled', notes: 'COPD exacerbation follow-up', priority: 'urgent' },
  { id: 'A005', patientId: 'P005', patientName: 'Maria Rodriguez', date: '2026-02-17', time: '14:00', duration: 30, type: 'checkup', status: 'scheduled', notes: 'Anemia treatment review', priority: 'normal' },
  { id: 'A006', patientId: 'P001', patientName: 'Sarah Johnson', date: '2026-02-20', time: '10:00', duration: 30, type: 'checkup', status: 'scheduled', priority: 'normal' },
  { id: 'A007', patientId: 'P002', patientName: 'Robert Martinez', date: '2026-02-22', time: '14:00', duration: 45, type: 'consultation', status: 'scheduled', priority: 'urgent' },
  { id: 'A008', patientId: 'P003', patientName: 'Emily Chen', date: '2026-02-19', time: '11:00', duration: 30, type: 'followup', status: 'scheduled', priority: 'normal' },
];

export const reminders: Reminder[] = [
  { id: 'R001', patientId: 'P003', patientName: 'Emily Chen', type: 'sms', message: 'Reminder: You have an appointment tomorrow at 9:00 AM with Dr. James Wilson.', scheduledAt: '2026-02-18T08:00:00', status: 'pending', appointmentId: 'A001' },
  { id: 'R002', patientId: 'P004', patientName: 'David Thompson', type: 'email', message: 'Reminder: Your appointment with Dr. Michael Chen is tomorrow at 9:30 AM.', scheduledAt: '2026-02-18T08:00:00', status: 'pending', appointmentId: 'A002' },
  { id: 'R003', patientId: 'P001', patientName: 'Sarah Johnson', type: 'sms', message: 'Reminder: Diabetes checkup appointment today at 10:30 AM.', scheduledAt: '2026-02-17T07:00:00', status: 'sent', appointmentId: 'A003' },
  { id: 'R004', patientId: 'P002', patientName: 'Robert Martinez', type: 'email', message: 'URGENT: Follow-up appointment today at 11:15 AM. Please arrive 10 min early.', scheduledAt: '2026-02-17T07:00:00', status: 'sent', appointmentId: 'A004' },
  { id: 'R005', patientId: 'P005', patientName: 'Maria Rodriguez', type: 'sms', message: 'Reminder: Your appointment is today at 2:00 PM. Please bring your insurance card.', scheduledAt: '2026-02-17T10:00:00', status: 'pending', appointmentId: 'A005' },
];

export const availableSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];

export const aiSummaries: Record<string, string> = {
  'P001': `**Sarah Johnson** is a 45-year-old female with a 2-year history of **Type 2 Diabetes** (HbA1c trending from 8.1% → 7.2%) and **Hypertension** (currently controlled at 128/82 mmHg).

**Key Concerns:** Glycemic control remains slightly above target. Last HbA1c 7.2% (goal <7%). Metformin dosage was recently increased.

**Current Medications:** Metformin 500mg BID, Lisinopril 10mg QD, Atorvastatin 20mg QHS.

**⚠️ Allergies:** Penicillin, Sulfa drugs — avoid these drug classes.

**AI Recommendation:** Consider scheduling cardiovascular risk assessment. Annual diabetic foot exam and ophthalmology referral due. Dietary counseling reinforcement advised given persistent hyperglycemia.

**Predicted Return:** Patient likely needs follow-up in **3 months** based on chronic disease management protocols.`,

  'P002': `**Robert Martinez** is a 62-year-old male with **COPD** (moderate severity) and **Atrial Fibrillation**, requiring anticoagulation therapy.

**Key Concerns:** Recent acute COPD exacerbation (SpO2 91%). Currently on oral steroid course. INR therapeutic at 2.4. High fall risk due to anticoagulation.

**Current Medications:** Tiotropium 18mcg QD, Warfarin 5mg QD (INR 2.4), Albuterol 90mcg PRN.

**⚠️ Allergies:** Aspirin — use alternative antiplatelet agents with caution.

**AI Recommendation:** Urgent: Pulmonary function tests recommended. Smoking cessation support if applicable. INR monitoring every 2-4 weeks. Consider pulmonology consultation for COPD optimization.

**Predicted Return:** **High priority** — follow-up needed within **2 weeks** given recent exacerbation.`,

  'P003': `**Emily Chen** is a 28-year-old female managing **Mild Persistent Asthma** (well-controlled) and **Generalized Anxiety Disorder** (improving on treatment).

**Key Concerns:** GAD-7 score improving (14 → 8). Sleep quality improving. Sertraline initiated 6 months ago showing positive response.

**Current Medications:** Fluticasone 110mcg BID inhaler, Sertraline 50mg QD.

**✅ No known drug allergies.**

**AI Recommendation:** Continue current Sertraline dose — strong treatment response. Therapy referral accepted, ensure follow-through. Asthma well-controlled, maintain current inhaler regimen. Consider tapering anxiety medication evaluation at 12-month mark.

**Predicted Return:** **6 weeks** for anxiety management review; annual asthma review in September.`,

  'P004': `**David Thompson** is a 55-year-old male with progressive **Bilateral Knee Osteoarthritis** and **Hypercholesterolemia**.

**Key Concerns:** Knee OA progressing — X-ray shows moderate joint space narrowing. Pain 6/10 with ambulation. Referred to orthopedics. LDL level review pending.

**Current Medications:** Naproxen 500mg BID with food, Rosuvastatin 10mg QD.

**⚠️ Allergies:** Codeine (likely opioid sensitivity), Latex.

**AI Recommendation:** Orthopedics referral critical — may be candidate for corticosteroid injections or joint replacement evaluation. Physical therapy adherence monitoring needed. Avoid NSAIDs long-term — consider GI protection. Lipid panel repeat in 3 months.

**Predicted Return:** **4 weeks** — orthopedics update and pain reassessment needed.`,

  'P005': `**Maria Rodriguez** is a 33-year-old female being treated for **Iron Deficiency Anemia** (Hgb 9.8) and **Migraine headaches** (well-managed).

**Key Concerns:** Hemoglobin significantly below normal. Iron stores critically low (ferritin 6 ng/mL). Iron supplementation just initiated. Root cause of anemia to be investigated (dietary, menorrhagia, absorption).

**Current Medications:** Sumatriptan 50mg PRN migraines, Ferrous sulfate 325mg QD.

**✅ No known drug allergies.**

**AI Recommendation:** Repeat CBC in 8 weeks to assess iron supplementation response. Investigate underlying cause of iron deficiency — consider GI evaluation if no improvement. Dietary iron counseling recommended. Migraine diary review at next visit.

**Predicted Return:** **8 weeks** for CBC recheck and treatment efficacy evaluation.`,
};
