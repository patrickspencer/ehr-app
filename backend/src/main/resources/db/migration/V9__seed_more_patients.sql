-- More patients for Dr. Roberts' panel
INSERT INTO patients (first_name, last_name, date_of_birth, gender, phone, email, address) VALUES
('Robert',    'Garcia',     '1958-04-12', 'Male',   '555-0201', 'robert.garcia@email.com',    '100 Birch Dr, Springfield, IL 62704'),
('Catherine', 'Liu',        '1981-08-23', 'Female', '555-0202', 'catherine.liu@email.com',    '210 Walnut St, Springfield, IL 62702'),
('Thomas',    'Anderson',   '1975-12-05', 'Male',   '555-0203', 'thomas.anderson@email.com',  '330 Spruce Ave, Springfield, IL 62703'),
('Diana',     'Kowalski',   '1992-02-14', 'Female', '555-0204', 'diana.kowalski@email.com',   '440 Ash Ct, Springfield, IL 62701'),
('William',   'Thompson',   '1965-06-30', 'Male',   '555-0205', 'william.thompson@email.com', '555 Hickory Ln, Portland, OR 97205'),
('Priya',     'Sharma',     '1988-11-19', 'Female', '555-0206', 'priya.sharma@email.com',     '660 Chestnut Blvd, Portland, OR 97210'),
('George',    'Nakamura',   '1950-03-08', 'Male',   '555-0207', 'george.nakamura@email.com',  '770 Sycamore Way, Seattle, WA 98105');

-- More patients for Dr. Kim's panel
INSERT INTO patients (first_name, last_name, date_of_birth, gender, phone, email, address) VALUES
('Angela',    'Foster',     '1979-07-17', 'Female', '555-0301', 'angela.foster@email.com',    '880 Magnolia Rd, Denver, CO 80204'),
('Marcus',    'Washington', '1963-09-25', 'Male',   '555-0302', 'marcus.washington@email.com','990 Poplar St, Denver, CO 80205'),
('Helen',     'Reeves',     '1947-01-31', 'Female', '555-0303', 'helen.reeves@email.com',     '101 Dogwood Ave, Austin, TX 78704'),
('Daniel',    'O''Brien',   '1983-05-22', 'Male',   '555-0304', 'daniel.obrien@email.com',    '202 Juniper Ct, Austin, TX 78702'),
('Sophia',    'Morales',    '1996-10-03', 'Female', '555-0305', 'sophia.morales@email.com',   '303 Willow Ln, Denver, CO 80206'),
('Frank',     'Petrov',     '1970-12-11', 'Male',   '555-0306', 'frank.petrov@email.com',     '404 Cypress Dr, Austin, TX 78703'),
('Irene',     'Chang',      '1955-08-09', 'Female', '555-0307', 'irene.chang@email.com',      '505 Redwood Pl, Denver, CO 80207');

-- Encounters for Dr. Roberts' new patients
INSERT INTO encounters (patient_id, encounter_date, encounter_type, status, provider, reason) VALUES
-- Robert Garcia (id 6) - cardiac patient
(6, '2025-06-10', 'NEW_PATIENT',   'COMPLETED', 'Dr. Roberts', 'New patient evaluation, history of hypertension and hyperlipidemia'),
(6, '2025-09-18', 'OFFICE_VISIT',  'COMPLETED', 'Dr. Roberts', 'Follow-up: blood pressure management, medication adjustment'),
(6, '2025-12-20', 'OFFICE_VISIT',  'COMPLETED', 'Dr. Roberts', 'Quarterly check-in, lipid panel review'),
(6, '2026-03-20', 'OFFICE_VISIT',  'PLANNED',   'Dr. Roberts', 'Blood pressure and cholesterol follow-up'),
-- Catherine Liu (id 7) - asthma + anxiety
(7, '2025-05-14', 'NEW_PATIENT',   'COMPLETED', 'Dr. Roberts', 'New patient intake, asthma and generalized anxiety'),
(7, '2025-08-22', 'OFFICE_VISIT',  'COMPLETED', 'Dr. Roberts', 'Asthma exacerbation, increased shortness of breath'),
(7, '2025-11-10', 'TELEHEALTH',    'COMPLETED', 'Dr. Roberts', 'Anxiety follow-up, medication management'),
(7, '2026-02-15', 'OFFICE_VISIT',  'COMPLETED', 'Dr. Roberts', 'Annual asthma review and spirometry'),
-- Thomas Anderson (id 8) - GERD + back pain
(8, '2025-07-03', 'OFFICE_VISIT',  'COMPLETED', 'Dr. Roberts', 'Persistent heartburn and acid reflux symptoms'),
(8, '2025-10-15', 'OFFICE_VISIT',  'COMPLETED', 'Dr. Roberts', 'Back pain evaluation, radiating to left leg'),
(8, '2026-01-20', 'FOLLOW_UP',     'COMPLETED', 'Dr. Roberts', 'GERD follow-up, back pain PT progress'),
-- Diana Kowalski (id 9) - migraines
(9, '2025-08-05', 'OFFICE_VISIT',  'COMPLETED', 'Dr. Roberts', 'Frequent migraines, 3-4 episodes per month'),
(9, '2025-11-20', 'FOLLOW_UP',     'COMPLETED', 'Dr. Roberts', 'Migraine prophylaxis follow-up, symptom diary review'),
(9, '2026-02-28', 'TELEHEALTH',    'COMPLETED', 'Dr. Roberts', 'Migraine management check-in'),
-- William Thompson (id 10) - diabetes + CKD
(10, '2025-04-10', 'NEW_PATIENT',  'COMPLETED', 'Dr. Roberts', 'Transfer of care, type 2 diabetes with early CKD'),
(10, '2025-07-15', 'OFFICE_VISIT', 'COMPLETED', 'Dr. Roberts', 'Diabetes quarterly review, HbA1c and renal function'),
(10, '2025-10-20', 'OFFICE_VISIT', 'COMPLETED', 'Dr. Roberts', 'Diabetes follow-up, CKD monitoring'),
(10, '2026-01-25', 'OFFICE_VISIT', 'COMPLETED', 'Dr. Roberts', 'Quarterly diabetes and renal check'),
-- Priya Sharma (id 11) - prenatal-like wellness + hypothyroidism
(11, '2025-06-20', 'OFFICE_VISIT', 'COMPLETED', 'Dr. Roberts', 'Annual wellness, hypothyroidism management'),
(11, '2025-12-05', 'OFFICE_VISIT', 'COMPLETED', 'Dr. Roberts', 'Thyroid level recheck, fatigue symptoms'),
-- George Nakamura (id 12) - elderly, multiple issues
(12, '2025-03-12', 'NEW_PATIENT',  'COMPLETED', 'Dr. Roberts', 'New patient, age 75, osteoarthritis and Parkinson disease'),
(12, '2025-06-18', 'OFFICE_VISIT', 'COMPLETED', 'Dr. Roberts', 'Parkinson medication titration, tremor assessment'),
(12, '2025-09-25', 'OFFICE_VISIT', 'COMPLETED', 'Dr. Roberts', 'Fall risk assessment, knee pain worsening'),
(12, '2025-12-30', 'OFFICE_VISIT', 'COMPLETED', 'Dr. Roberts', 'Quarterly Parkinson review, mobility status'),
(12, '2026-03-15', 'OFFICE_VISIT', 'PLANNED',   'Dr. Roberts', 'Comprehensive geriatric follow-up');

-- Encounters for Dr. Kim's new patients
INSERT INTO encounters (patient_id, encounter_date, encounter_type, status, provider, reason) VALUES
-- Angela Foster (id 13) - depression + obesity
(13, '2025-05-08', 'NEW_PATIENT',   'COMPLETED', 'Dr. Kim', 'New patient evaluation, depression and weight management'),
(13, '2025-08-14', 'OFFICE_VISIT',  'COMPLETED', 'Dr. Kim', 'Depression follow-up, SSRI titration'),
(13, '2025-11-22', 'OFFICE_VISIT',  'COMPLETED', 'Dr. Kim', 'Weight management program check-in, dietary counseling'),
(13, '2026-02-20', 'TELEHEALTH',    'COMPLETED', 'Dr. Kim', 'Depression medication review, mood assessment'),
-- Marcus Washington (id 14) - hypertension + afib
(14, '2025-04-15', 'NEW_PATIENT',   'COMPLETED', 'Dr. Kim', 'New patient, hypertension and atrial fibrillation'),
(14, '2025-07-22', 'OFFICE_VISIT',  'COMPLETED', 'Dr. Kim', 'Anticoagulation management, blood pressure review'),
(14, '2025-10-28', 'OFFICE_VISIT',  'COMPLETED', 'Dr. Kim', 'Afib rate control assessment, ECG review'),
(14, '2026-01-30', 'OFFICE_VISIT',  'COMPLETED', 'Dr. Kim', 'Cardiology co-management follow-up'),
-- Helen Reeves (id 15) - elderly, heart failure + anemia
(15, '2025-03-20', 'NEW_PATIENT',   'COMPLETED', 'Dr. Kim', 'New patient, age 78, CHF and anemia workup'),
(15, '2025-06-10', 'OFFICE_VISIT',  'COMPLETED', 'Dr. Kim', 'Heart failure volume status, diuretic adjustment'),
(15, '2025-09-05', 'URGENT_CARE',   'COMPLETED', 'Dr. Kim', 'Acute dyspnea exacerbation, possible CHF decompensation'),
(15, '2025-12-12', 'OFFICE_VISIT',  'COMPLETED', 'Dr. Kim', 'Post-hospitalization follow-up, stable CHF'),
(15, '2026-03-10', 'OFFICE_VISIT',  'PLANNED',   'Dr. Kim', 'CHF quarterly review'),
-- Daniel O'Brien (id 16) - low back pain + insomnia
(16, '2025-07-01', 'OFFICE_VISIT',  'COMPLETED', 'Dr. Kim', 'Chronic low back pain, sleep disturbance'),
(16, '2025-10-10', 'FOLLOW_UP',     'COMPLETED', 'Dr. Kim', 'Back pain PT progress, insomnia CBT referral'),
(16, '2026-01-15', 'TELEHEALTH',    'COMPLETED', 'Dr. Kim', 'Insomnia follow-up, sleep hygiene review'),
-- Sophia Morales (id 17) - acne + anxiety
(17, '2025-09-12', 'NEW_PATIENT',   'COMPLETED', 'Dr. Kim', 'New patient, cystic acne and anxiety symptoms'),
(17, '2026-01-08', 'FOLLOW_UP',     'COMPLETED', 'Dr. Kim', 'Acne treatment progress, anxiety management'),
-- Frank Petrov (id 18) - COPD + nicotine dependence
(18, '2025-05-20', 'NEW_PATIENT',   'COMPLETED', 'Dr. Kim', 'New patient, COPD and active smoking cessation counseling'),
(18, '2025-08-25', 'OFFICE_VISIT',  'COMPLETED', 'Dr. Kim', 'COPD exacerbation follow-up, smoking cessation update'),
(18, '2025-11-30', 'OFFICE_VISIT',  'COMPLETED', 'Dr. Kim', 'Pulmonary function recheck, continued cessation support'),
(18, '2026-03-01', 'OFFICE_VISIT',  'PLANNED',   'Dr. Kim', 'COPD quarterly review'),
-- Irene Chang (id 19) - hypothyroidism + osteoarthritis
(19, '2025-04-25', 'NEW_PATIENT',   'COMPLETED', 'Dr. Kim', 'New patient, hypothyroidism and bilateral knee OA'),
(19, '2025-08-05', 'OFFICE_VISIT',  'COMPLETED', 'Dr. Kim', 'Thyroid level check, knee pain management'),
(19, '2025-11-15', 'OFFICE_VISIT',  'COMPLETED', 'Dr. Kim', 'OA flare right knee, cortisone injection discussion'),
(19, '2026-02-10', 'OFFICE_VISIT',  'COMPLETED', 'Dr. Kim', 'Thyroid stable, knee PT referral');

-- Notes for Dr. Roberts' patients
INSERT INTO notes (patient_id, content, author) VALUES
-- Robert Garcia
(6, 'Patient is a 67-year-old male with PMH of HTN x 15 years and hyperlipidemia. Currently on lisinopril 20mg daily and atorvastatin 40mg nightly. BP today 142/88. Discussed lifestyle modifications including DASH diet. Increased lisinopril to 40mg. Recheck in 3 months.', 'Dr. Roberts'),
(6, 'BP improved to 132/80 on lisinopril 40mg. Lipid panel: TC 195, LDL 110, HDL 48, TG 160. LDL still above goal. Increased atorvastatin to 80mg. Reinforced dietary counseling.', 'Dr. Roberts'),
(6, 'Quarterly visit. BP 128/78, well controlled. Lipid panel improved: LDL 88, HDL 52. Patient reports adherence to Mediterranean diet. Continue current regimen.', 'Dr. Roberts'),
-- Catherine Liu
(7, 'New patient, 43F. PMH: mild intermittent asthma since childhood, GAD diagnosed 2 years ago. Currently on albuterol PRN and sertraline 50mg daily. Asthma well-controlled, uses rescue inhaler ~1x/month. Anxiety moderately controlled but reports increased work stress. Discussed coping strategies.', 'Dr. Roberts'),
(7, 'Acute visit for asthma flare. Using albuterol 4-5x daily for 3 days. Lung exam with scattered wheezing. Started prednisone burst 40mg x 5 days and added fluticasone 110mcg BID as maintenance. Follow up in 2 weeks.', 'Dr. Roberts'),
(7, 'Telehealth visit. Anxiety worsening with seasonal change. PHQ-9 score 12 (moderate). Increased sertraline to 100mg. Referred to therapy. Will recheck in 8 weeks.', 'Dr. Roberts'),
(7, 'Asthma well-controlled on fluticasone. No rescue inhaler use in 6 weeks. Anxiety improved on sertraline 100mg, PHQ-9 now 6. Continue current plan.', 'Dr. Roberts'),
-- Thomas Anderson
(8, 'Patient reports 3-month history of burning epigastric pain worse after meals. No red flag symptoms. Started omeprazole 20mg daily before breakfast. Advised dietary modifications: avoid spicy foods, caffeine, late-night eating.', 'Dr. Roberts'),
(8, 'New complaint of low back pain x 2 weeks, radiating to posterior left thigh. No neurologic deficits. Negative straight leg raise. Likely lumbar strain. Prescribed naproxen 500mg BID x 10 days and PT referral.', 'Dr. Roberts'),
(8, 'GERD well-controlled on omeprazole. Back pain significantly improved after 8 PT sessions. Can now walk 30 min without pain. Will taper naproxen to PRN. Continue PT 1x/week for 4 more weeks.', 'Dr. Roberts'),
-- Diana Kowalski
(9, 'Patient reports chronic migraines since age 25, currently averaging 3-4 episodes per month lasting 8-12 hours each. Triggers include stress, poor sleep, and menstruation. Currently using sumatriptan PRN. Started topiramate 25mg nightly for prophylaxis, titrate to 50mg after 2 weeks.', 'Dr. Roberts'),
(9, 'Migraine frequency decreased to 1-2 per month on topiramate 50mg. Patient keeping headache diary. Reports mild paresthesias in fingertips as side effect. Weight stable. Continue current dose.', 'Dr. Roberts'),
(9, 'Telehealth check-in. Migraines stable at 1-2/month. Sumatriptan effective for acute episodes. Paresthesias resolved. Patient satisfied with prophylaxis. Continue topiramate 50mg.', 'Dr. Roberts'),
-- William Thompson
(10, 'Transfer of care. 60M with T2DM x 12 years, now on metformin 1000mg BID and glipizide 10mg daily. Recent HbA1c 7.8%. Also has stage 3a CKD (eGFR 52). Reviewed records. Will check comprehensive metabolic panel and urine albumin-to-creatinine ratio. Discussed importance of renal-protective glucose management.', 'Dr. Roberts'),
(10, 'HbA1c 7.4%, improving. eGFR stable at 50. UACR 45 (mildly elevated). Started lisinopril 10mg for renal protection. Added empagliflozin 10mg for dual cardiorenal benefit. Dietary referral for diabetic diet with CKD modifications.', 'Dr. Roberts'),
(10, 'HbA1c 7.0%, at target. eGFR 51, stable. UACR improved to 32. Empagliflozin well-tolerated. Continue current regimen. Reinforced foot exam and annual ophthalmology visit.', 'Dr. Roberts'),
(10, 'Quarterly visit. HbA1c 6.9%, excellent control. Renal function stable. Patient reports good adherence to diet. Completed retinal exam - no retinopathy. Continue current plan.', 'Dr. Roberts'),
-- Priya Sharma
(11, 'Annual wellness visit. 36F with hypothyroidism on levothyroxine 75mcg daily. TSH 3.2 (normal). Reports occasional fatigue. CBC, CMP normal. BMI 23. Counseled on sleep hygiene and stress management.', 'Dr. Roberts'),
(11, 'Reports increased fatigue, cold intolerance, dry skin for 6 weeks. TSH elevated at 8.4. Increased levothyroxine to 88mcg daily. Recheck TSH in 6 weeks.', 'Dr. Roberts'),
-- George Nakamura
(12, 'New patient, 75M. PMH: Parkinson disease (diagnosed 3 years ago, on carbidopa-levodopa 25/100 TID), bilateral knee OA, benign prostatic hyperplasia. Tremor predominantly right-sided, mild bradykinesia. MMSE 28/30. Gait slightly shuffling but stable. Fall risk moderate. Discussed home safety modifications.', 'Dr. Roberts'),
(12, 'Parkinson follow-up. Tremor slightly increased. Wearing-off effect noted before next dose. Adjusted carbidopa-levodopa to QID dosing. Added entacapone to extend levodopa effect. Physical therapy referral for gait training.', 'Dr. Roberts'),
(12, 'Reports 2 near-falls this month. Right knee pain worsening, limiting mobility. Knee X-ray shows moderate OA. Started duloxetine 30mg for pain (also may help with Parkinson depression). Ordered PT for balance training. Discussed assistive devices.', 'Dr. Roberts'),
(12, 'Parkinson stable on adjusted regimen. No falls since starting PT and using cane. Knee pain improved with duloxetine. Mood brighter. MMSE 27/30. Continue current plan. Schedule neurology co-management visit.', 'Dr. Roberts');

-- Notes for Dr. Kim's patients
INSERT INTO notes (patient_id, content, author) VALUES
-- Angela Foster
(13, 'New patient, 46F. PMH: MDD (moderate) x 5 years, BMI 38.2 (morbid obesity). Currently on fluoxetine 20mg daily. PHQ-9 score 15 (moderately severe). Discussed comprehensive weight management program including nutritional counseling and structured exercise plan. Increased fluoxetine to 40mg.', 'Dr. Kim'),
(13, 'Depression improving. PHQ-9 now 11. Weight down 4 lbs to BMI 37.5. Patient started walking program, 20 min x 4 days/week. Continues dietary counseling. Fluoxetine 40mg well-tolerated.', 'Dr. Kim'),
(13, 'Weight management visit. BMI 36.8, down 8 lbs total. Nutritionist reports improved food diary compliance. Depression stable, PHQ-9 9. Discussed GLP-1 agonist for weight management. Patient interested, will start semaglutide 0.25mg weekly.', 'Dr. Kim'),
(13, 'Telehealth. Mood stable on fluoxetine 40mg, PHQ-9 7. Tolerating semaglutide well, now at 0.5mg weekly. Weight 218 lbs (down 12 lbs). GI side effects mild. Continue titration plan.', 'Dr. Kim'),
-- Marcus Washington
(14, 'New patient, 62M. HTN poorly controlled (BP 158/94 on amlodipine 10mg alone). Also has paroxysmal atrial fibrillation, on apixaban 5mg BID. CHA2DS2-VASc score 3. Added hydrochlorothiazide 25mg and metoprolol succinate 50mg for rate control. ECG today: normal sinus rhythm, rate 78.', 'Dr. Kim'),
(14, 'BP improved to 138/84. Metoprolol well-tolerated, resting HR 68. Patient reports one episode of palpitations lasting 20 min last month, self-resolved. INR not needed on apixaban. Increased HCTZ to consider if BP not at goal next visit.', 'Dr. Kim'),
(14, 'ECG shows rate-controlled afib today, rate 72. BP 134/82. No stroke symptoms. Discussed signs of stroke and when to seek emergency care. Continue apixaban. Echocardiogram ordered to assess LV function.', 'Dr. Kim'),
(14, 'Echo results: LVEF 55%, mild left atrial enlargement, no valvular disease. BP at goal 130/78. Afib rate well-controlled. Cardiology agrees with current management. Continue current medications.', 'Dr. Kim'),
-- Helen Reeves
(15, 'New patient, 78F. PMH: CHF (HFrEF, EF 35%), anemia (Hgb 10.2), HTN, hypothyroidism. On furosemide 40mg daily, carvedilol 12.5mg BID, lisinopril 20mg, levothyroxine 50mcg. Weight 152 lbs, mild bilateral ankle edema. NT-proBNP 1200. Iron studies ordered for anemia workup.', 'Dr. Kim'),
(15, 'CHF stable. Weight 148 lbs, edema improved. Iron studies: ferritin 18, TIBC elevated - iron deficiency anemia confirmed. Started ferrous sulfate 325mg daily with vitamin C. Will recheck CBC in 8 weeks. Discussed fluid restriction to 1.5L/day.', 'Dr. Kim'),
(15, 'Urgent visit. Patient presents with worsening dyspnea x 3 days, 5 lb weight gain, 3+ ankle edema bilaterally. Lungs with bibasilar crackles. SpO2 93%. NT-proBNP 3400. Started IV furosemide 40mg, arranged direct admission for CHF exacerbation.', 'Dr. Kim'),
(15, 'Post-discharge follow-up (hospitalized 5 days). Discharged on furosemide 60mg daily, added spironolactone 25mg. Weight 146 lbs, euvolemic. Hgb improved to 11.1 on iron. Strict daily weights and low sodium diet reinforced. Close follow-up in 2 weeks.', 'Dr. Kim'),
-- Daniel O'Brien
(16, 'Patient 42M with chronic low back pain x 2 years and insomnia x 6 months. Pain is dull, constant, worse with prolonged sitting. No radiculopathy. Sleep onset latency 45-60 min, waking 2-3x nightly. Avoiding opioids per patient preference. Started cyclobenzaprine 10mg at bedtime, PT referral. Discussed CBT-I for insomnia.', 'Dr. Kim'),
(16, 'Back pain mildly improved with PT (6 sessions completed). Core strengthening helping. Insomnia persists. Started CBT-I program. Cyclobenzaprine causing morning drowsiness, switched to 5mg. Added melatonin 3mg at bedtime.', 'Dr. Kim'),
(16, 'Telehealth. Sleep improving with CBT-I, now falling asleep in 20 min. Back pain 4/10, down from 7/10. Continuing PT exercises at home. Tolerating melatonin well. Will reassess in 3 months.', 'Dr. Kim'),
-- Sophia Morales
(17, 'New patient, 29F. Cystic acne affecting face, chest, and back x 3 years. Prior treatment with topical benzoyl peroxide and clindamycin with partial response. Also reports anxiety symptoms, GAD-7 score 11. Started doxycycline 100mg BID for acne, referred to dermatology. Started sertraline 25mg for anxiety.', 'Dr. Kim'),
(17, 'Acne improving on doxycycline, fewer cystic lesions. Dermatology considering isotretinoin if no further improvement. Anxiety improved, GAD-7 8. Increased sertraline to 50mg. Tolerating well.', 'Dr. Kim'),
-- Frank Petrov
(18, 'New patient, 55M. COPD (GOLD stage 2, FEV1 65% predicted), active smoker 30 pack-years. Currently on tiotropium 18mcg inhaler daily. Motivated to quit smoking. Started nicotine patch 21mg + PRN nicotine gum. Discussed quit plan. Pulmonary rehab referral.', 'Dr. Kim'),
(18, 'COPD exacerbation 2 weeks ago, treated with prednisone burst and azithromycin by urgent care. Now recovered. Smoking reduced to 5 cigarettes/day from 1 pack/day. Continued NRT. Added fluticasone/salmeterol 250/50 for COPD maintenance. Praised progress on smoking reduction.', 'Dr. Kim'),
(18, 'PFTs show FEV1 stable at 63%. Patient now smoking 2-3 cigarettes/day. Transitioning to varenicline from NRT. Pulmonary rehab going well, improved exercise tolerance. Dyspnea improved from mMRC 2 to 1.', 'Dr. Kim'),
-- Irene Chang
(19, 'New patient, 70F. Hypothyroidism on levothyroxine 100mcg, TSH 2.8 (normal). Bilateral knee OA, worse on right, pain 6/10 with walking. X-ray: moderate-severe OA right knee, moderate left. Currently on acetaminophen 1000mg BID. Added meloxicam 15mg daily. Discussed weight-bearing exercise and PT.', 'Dr. Kim'),
(19, 'TSH normal at 3.1. Right knee pain improved to 4/10 on meloxicam + PT. Left knee stable. Discussed options if medical management fails: cortisone injection vs. viscosupplementation. Patient prefers conservative approach for now.', 'Dr. Kim'),
(19, 'Right knee flare after gardening, pain 8/10 with swelling. Effusion present. Aspirated 20mL of synovial fluid (non-inflammatory). Injected triamcinolone 40mg. Applied knee brace. Rest and ice for 48 hours, then gradual return to PT.', 'Dr. Kim'),
(19, 'Post-injection follow-up. Right knee pain improved to 3/10. Resumed PT. Thyroid stable. Added vitamin D 2000 IU daily (level was 22). Continue current OA management plan.', 'Dr. Kim');
