INSERT INTO patients (first_name, last_name, date_of_birth, gender, phone, email, address) VALUES
('Tara',    'Nguyen',  '1987-09-08', 'Female', '555-0501', 'tara.nguyen@email.com',   '777 Olive Terrace, Sacramento, CA 95814'),
('Leon',    'Fischer', '1974-03-27', 'Male',   '555-0502', 'leon.fischer@email.com',  '888 Summit Ridge Rd, Boulder, CO 80302'),
('Maya',    'Coleman', '1993-12-16', 'Female', '555-0503', 'maya.coleman@email.com',  '999 Bay Street, Charleston, SC 29401'),
('Dennis',  'Harper',  '1956-05-05', 'Male',   '555-0504', 'dennis.harper@email.com', '121 Orchard Lane, Madison, WI 53703'),
('Elena',   'Ruiz',    '1982-07-21', 'Female', '555-0505', 'elena.ruiz@email.com',    '343 Crescent Ave, Albuquerque, NM 87102');

INSERT INTO encounters (patient_id, encounter_date, encounter_type, status, provider, reason)
SELECT p.id, v.encounter_date, v.encounter_type, v.status, v.provider, v.reason
FROM patients p
JOIN (
    VALUES
        ('tara.nguyen@email.com',   DATE '2025-07-18', 'NEW_PATIENT', 'COMPLETED', 'Dr. Roberts', 'Type 2 diabetes and hypertension transfer of care'),
        ('tara.nguyen@email.com',   DATE '2026-01-09', 'FOLLOW_UP',   'COMPLETED', 'Dr. Roberts', 'A1c and blood pressure follow-up'),
        ('leon.fischer@email.com',  DATE '2025-08-28', 'NEW_PATIENT', 'COMPLETED', 'Dr. Kim',     'Coronary risk review, insomnia, and nicotine dependence'),
        ('maya.coleman@email.com',  DATE '2025-09-30', 'NEW_PATIENT', 'COMPLETED', 'Dr. Roberts', 'Asthma and anxiety management intake'),
        ('dennis.harper@email.com', DATE '2025-06-06', 'NEW_PATIENT', 'COMPLETED', 'Dr. Kim',     'Heart failure follow-up after hospitalization'),
        ('elena.ruiz@email.com',    DATE '2025-10-24', 'NEW_PATIENT', 'COMPLETED', 'Dr. Roberts', 'Migraine and dermatitis evaluation')
) AS v(email, encounter_date, encounter_type, status, provider, reason)
  ON p.email = v.email;

INSERT INTO notes (patient_id, encounter_id, content, author)
SELECT p.id, e.id, v.content, v.author
FROM (
    VALUES
        ('tara.nguyen@email.com',   DATE '2025-07-18', 'Dr. Roberts', '38F with T2DM and hypertension transferring care. On metformin and losartan. A1c 7.4. Discussed nutrition and home blood pressure log.'),
        ('tara.nguyen@email.com',   DATE '2026-01-09', 'Dr. Roberts', 'A1c improved to 6.9. Home BPs mostly controlled. Continue current regimen and reinforce foot care.'),
        ('leon.fischer@email.com',  DATE '2025-08-28', 'Dr. Kim',     '51M with elevated ASCVD risk, poor sleep, and ongoing smoking. Started rosuvastatin and nicotine lozenges. Sleep hygiene reviewed.'),
        ('maya.coleman@email.com',  DATE '2025-09-30', 'Dr. Roberts', '32F with asthma triggered by exercise and seasonal allergies, plus generalized anxiety. Started budesonide inhaler and resumed sertraline.'),
        ('dennis.harper@email.com', DATE '2025-06-06', 'Dr. Kim',     '69M recently hospitalized for CHF exacerbation. Euvolemic today. Reinforced daily weights, low sodium diet, and diuretic adherence.'),
        ('elena.ruiz@email.com',    DATE '2025-10-24', 'Dr. Roberts', '43F with recurrent migraines and chronic hand dermatitis. Restarted triptan PRN and topical steroid. Trigger diary reviewed.')
) AS v(email, encounter_date, author, content)
JOIN patients p ON p.email = v.email
JOIN encounters e ON e.patient_id = p.id AND e.encounter_date = v.encounter_date;

INSERT INTO encounter_diagnoses (encounter_id, icd10_code_id)
SELECT e.id, c.id
FROM (
    VALUES
        ('tara.nguyen@email.com',   DATE '2025-07-18', 'E11.9'),
        ('tara.nguyen@email.com',   DATE '2025-07-18', 'I10'),
        ('tara.nguyen@email.com',   DATE '2026-01-09', 'E11.9'),
        ('leon.fischer@email.com',  DATE '2025-08-28', 'E78.5'),
        ('leon.fischer@email.com',  DATE '2025-08-28', 'F17.210'),
        ('leon.fischer@email.com',  DATE '2025-08-28', 'G47.00'),
        ('maya.coleman@email.com',  DATE '2025-09-30', 'J45.20'),
        ('maya.coleman@email.com',  DATE '2025-09-30', 'F41.1'),
        ('dennis.harper@email.com', DATE '2025-06-06', 'I50.9'),
        ('dennis.harper@email.com', DATE '2025-06-06', 'I10'),
        ('elena.ruiz@email.com',    DATE '2025-10-24', 'G43.909'),
        ('elena.ruiz@email.com',    DATE '2025-10-24', 'L30.9')
) AS v(email, encounter_date, icd_code)
JOIN patients p ON p.email = v.email
JOIN encounters e ON e.patient_id = p.id AND e.encounter_date = v.encounter_date
JOIN icd10_codes c ON c.code = v.icd_code;

INSERT INTO encounter_procedures (encounter_id, cpt_code_id)
SELECT e.id, c.id
FROM (
    VALUES
        ('tara.nguyen@email.com',   DATE '2025-07-18', '99204'),
        ('tara.nguyen@email.com',   DATE '2026-01-09', '99214'),
        ('leon.fischer@email.com',  DATE '2025-08-28', '99204'),
        ('maya.coleman@email.com',  DATE '2025-09-30', '99203'),
        ('dennis.harper@email.com', DATE '2025-06-06', '99214'),
        ('elena.ruiz@email.com',    DATE '2025-10-24', '99203')
) AS v(email, encounter_date, cpt_code)
JOIN patients p ON p.email = v.email
JOIN encounters e ON e.patient_id = p.id AND e.encounter_date = v.encounter_date
JOIN cpt_codes c ON c.code = v.cpt_code;
