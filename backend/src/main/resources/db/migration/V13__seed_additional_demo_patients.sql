INSERT INTO patients (first_name, last_name, date_of_birth, gender, phone, email, address) VALUES
('Laura',  'Simmons', '1984-02-11', 'Female', '555-0401', 'laura.simmons@email.com',  '111 Desert Bloom Rd, Phoenix, AZ 85004'),
('Omar',   'Hassan',  '1978-10-07', 'Male',   '555-0402', 'omar.hassan@email.com',   '222 Canyon View Dr, Phoenix, AZ 85006'),
('Julia',  'Bennett', '1991-04-19', 'Female', '555-0403', 'julia.bennett@email.com', '333 River Birch Ln, Nashville, TN 37203'),
('Victor', 'Alvarez', '1966-12-02', 'Male',   '555-0404', 'victor.alvarez@email.com', '444 Garden Walk Ave, San Diego, CA 92103'),
('Naomi',  'Baker',   '1989-06-28', 'Female', '555-0405', 'naomi.baker@email.com',   '555 Harbor Point Dr, Tampa, FL 33602'),
('Samuel', 'Reed',    '1959-01-14', 'Male',   '555-0406', 'samuel.reed@email.com',   '666 Lakefront Blvd, Milwaukee, WI 53202');

INSERT INTO encounters (patient_id, encounter_date, encounter_type, status, provider, reason)
SELECT p.id, v.encounter_date, v.encounter_type, v.status, v.provider, v.reason
FROM patients p
JOIN (
    VALUES
        ('laura.simmons@email.com',  DATE '2025-06-18', 'NEW_PATIENT', 'COMPLETED', 'Dr. Roberts', 'New patient evaluation, reflux symptoms and generalized anxiety'),
        ('laura.simmons@email.com',  DATE '2025-10-02', 'FOLLOW_UP',   'COMPLETED', 'Dr. Roberts', 'GERD follow-up and anxiety medication review'),
        ('omar.hassan@email.com',    DATE '2025-07-09', 'NEW_PATIENT', 'COMPLETED', 'Dr. Kim',     'Prediabetes, elevated liver enzymes, and weight counseling'),
        ('omar.hassan@email.com',    DATE '2025-11-21', 'FOLLOW_UP',   'COMPLETED', 'Dr. Kim',     'Metabolic follow-up and liver panel review'),
        ('julia.bennett@email.com',  DATE '2025-08-14', 'NEW_PATIENT', 'COMPLETED', 'Dr. Roberts', 'Allergic rhinitis and chronic dermatitis intake'),
        ('julia.bennett@email.com',  DATE '2026-02-06', 'FOLLOW_UP',   'COMPLETED', 'Dr. Roberts', 'Seasonal allergy flare and rash follow-up'),
        ('victor.alvarez@email.com', DATE '2025-05-30', 'NEW_PATIENT', 'COMPLETED', 'Dr. Kim',     'Coronary disease risk review and dyslipidemia management'),
        ('victor.alvarez@email.com', DATE '2025-09-26', 'FOLLOW_UP',   'COMPLETED', 'Dr. Kim',     'Lipid follow-up and exercise counseling'),
        ('naomi.baker@email.com',    DATE '2025-09-04', 'NEW_PATIENT', 'COMPLETED', 'Dr. Roberts', 'Migraines and chronic insomnia evaluation'),
        ('naomi.baker@email.com',    DATE '2026-01-16', 'FOLLOW_UP',   'COMPLETED', 'Dr. Roberts', 'Headache diary review and sleep follow-up'),
        ('samuel.reed@email.com',    DATE '2025-06-25', 'NEW_PATIENT', 'COMPLETED', 'Dr. Kim',     'COPD management and smoking cessation intake'),
        ('samuel.reed@email.com',    DATE '2025-12-12', 'FOLLOW_UP',   'COMPLETED', 'Dr. Kim',     'Pulmonary follow-up and tobacco cessation progress')
) AS v(email, encounter_date, encounter_type, status, provider, reason)
    ON p.email = v.email;

INSERT INTO notes (patient_id, encounter_id, content, author)
SELECT p.id, e.id, v.content, v.author
FROM (
    VALUES
        ('laura.simmons@email.com',  DATE '2025-06-18', 'Dr. Roberts', 'New patient, 41F. Reports daily reflux after late meals and escalating anxiety over the last 6 months. Started omeprazole 20mg daily and sertraline 25mg daily. Reviewed reflux trigger avoidance and counseling referral.'),
        ('laura.simmons@email.com',  DATE '2025-10-02', 'Dr. Roberts', 'Reflux improved on omeprazole with fewer nocturnal symptoms. Anxiety improved modestly; increased sertraline to 50mg daily. Reinforced sleep hygiene and caffeine reduction.'),
        ('omar.hassan@email.com',    DATE '2025-07-09', 'Dr. Kim',     '47M with BMI 31. Prediabetes confirmed with A1c 6.1. ALT mildly elevated and ultrasound previously showed fatty infiltration. Started intensive diet counseling and metformin XR 500mg nightly.'),
        ('omar.hassan@email.com',    DATE '2025-11-21', 'Dr. Kim',     'A1c down to 5.8 after weight loss of 9 lbs. ALT improved but still mildly elevated. Increased exercise consistency. Continue metformin XR and Mediterranean-style diet.'),
        ('julia.bennett@email.com',  DATE '2025-08-14', 'Dr. Roberts', '34F with perennial allergic rhinitis and recurrent flexural dermatitis. Started cetirizine 10mg daily, fluticasone nasal spray, and triamcinolone 0.1% cream for flares.'),
        ('julia.bennett@email.com',  DATE '2026-02-06', 'Dr. Roberts', 'Spring allergy flare with nasal congestion and itchy eyes. Dermatitis controlled overall with intermittent flares. Added azelastine nasal spray PRN and reviewed fragrance-free skin products.'),
        ('victor.alvarez@email.com', DATE '2025-05-30', 'Dr. Kim',     '58M with known CAD and longstanding dyslipidemia establishing care. On atorvastatin but LDL remains above goal. Reinforced exercise plan and increased statin intensity.'),
        ('victor.alvarez@email.com', DATE '2025-09-26', 'Dr. Kim',     'LDL improved to 82 on higher-dose statin. No angina. Continues walking program 5 days per week. Added low-dose ezetimibe for secondary prevention optimization.'),
        ('naomi.baker@email.com',    DATE '2025-09-04', 'Dr. Roberts', '36F with migraines 2-3 times weekly and difficulty initiating sleep. Started topiramate 25mg nightly and advised magnesium supplementation. Sleep log reviewed.'),
        ('naomi.baker@email.com',    DATE '2026-01-16', 'Dr. Roberts', 'Headache frequency reduced to 3 per month. Sleep latency improved modestly with trazodone 50mg at bedtime. Continue diary and hydration goals.'),
        ('samuel.reed@email.com',    DATE '2025-06-25', 'Dr. Kim',     '66M with COPD and active smoking, 35 pack-year history. Started tiotropium daily and nicotine patch. Reviewed inhaler technique and red-flag symptoms.'),
        ('samuel.reed@email.com',    DATE '2025-12-12', 'Dr. Kim',     'Breathing stable with tiotropium and fewer rescue inhaler uses. Smoking reduced to 2 cigarettes/day. Continue nicotine replacement and pulmonary rehab exercises.' )
) AS v(email, encounter_date, author, content)
JOIN patients p
    ON p.email = v.email
JOIN encounters e
    ON e.patient_id = p.id
   AND e.encounter_date = v.encounter_date;

INSERT INTO encounter_diagnoses (encounter_id, icd10_code_id)
SELECT e.id, c.id
FROM (
    VALUES
        ('laura.simmons@email.com',  DATE '2025-06-18', 'K21.0'),
        ('laura.simmons@email.com',  DATE '2025-06-18', 'F41.1'),
        ('laura.simmons@email.com',  DATE '2025-10-02', 'K21.0'),
        ('laura.simmons@email.com',  DATE '2025-10-02', 'F41.1'),
        ('omar.hassan@email.com',    DATE '2025-07-09', 'R73.03'),
        ('omar.hassan@email.com',    DATE '2025-07-09', 'K76.0'),
        ('omar.hassan@email.com',    DATE '2025-11-21', 'R73.03'),
        ('omar.hassan@email.com',    DATE '2025-11-21', 'K76.0'),
        ('julia.bennett@email.com',  DATE '2025-08-14', 'J30.1'),
        ('julia.bennett@email.com',  DATE '2025-08-14', 'L30.9'),
        ('julia.bennett@email.com',  DATE '2026-02-06', 'J30.1'),
        ('julia.bennett@email.com',  DATE '2026-02-06', 'L30.9'),
        ('victor.alvarez@email.com', DATE '2025-05-30', 'I25.10'),
        ('victor.alvarez@email.com', DATE '2025-05-30', 'E78.5'),
        ('victor.alvarez@email.com', DATE '2025-09-26', 'I25.10'),
        ('victor.alvarez@email.com', DATE '2025-09-26', 'E78.5'),
        ('naomi.baker@email.com',    DATE '2025-09-04', 'G43.909'),
        ('naomi.baker@email.com',    DATE '2025-09-04', 'G47.00'),
        ('naomi.baker@email.com',    DATE '2026-01-16', 'G43.909'),
        ('naomi.baker@email.com',    DATE '2026-01-16', 'G47.00'),
        ('samuel.reed@email.com',    DATE '2025-06-25', 'J44.1'),
        ('samuel.reed@email.com',    DATE '2025-06-25', 'F17.210'),
        ('samuel.reed@email.com',    DATE '2025-12-12', 'J44.1'),
        ('samuel.reed@email.com',    DATE '2025-12-12', 'F17.210')
) AS v(email, encounter_date, icd_code)
JOIN patients p
    ON p.email = v.email
JOIN encounters e
    ON e.patient_id = p.id
   AND e.encounter_date = v.encounter_date
JOIN icd10_codes c
    ON c.code = v.icd_code;

INSERT INTO encounter_procedures (encounter_id, cpt_code_id)
SELECT e.id, c.id
FROM (
    VALUES
        ('laura.simmons@email.com',  DATE '2025-06-18', '99204'),
        ('laura.simmons@email.com',  DATE '2025-10-02', '99214'),
        ('omar.hassan@email.com',    DATE '2025-07-09', '99204'),
        ('omar.hassan@email.com',    DATE '2025-07-09', '80053'),
        ('omar.hassan@email.com',    DATE '2025-07-09', '80061'),
        ('omar.hassan@email.com',    DATE '2025-11-21', '99214'),
        ('julia.bennett@email.com',  DATE '2025-08-14', '99203'),
        ('julia.bennett@email.com',  DATE '2026-02-06', '99213'),
        ('victor.alvarez@email.com', DATE '2025-05-30', '99204'),
        ('victor.alvarez@email.com', DATE '2025-05-30', '80061'),
        ('victor.alvarez@email.com', DATE '2025-09-26', '99214'),
        ('naomi.baker@email.com',    DATE '2025-09-04', '99203'),
        ('naomi.baker@email.com',    DATE '2026-01-16', '99213'),
        ('samuel.reed@email.com',    DATE '2025-06-25', '99204'),
        ('samuel.reed@email.com',    DATE '2025-12-12', '99214')
) AS v(email, encounter_date, cpt_code)
JOIN patients p
    ON p.email = v.email
JOIN encounters e
    ON e.patient_id = p.id
   AND e.encounter_date = v.encounter_date
JOIN cpt_codes c
    ON c.code = v.cpt_code;
