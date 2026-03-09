WITH new_patient_profiles(email, profile) AS (
    VALUES
        ('tara.nguyen@email.com',   'tara_diabetes_htn'),
        ('leon.fischer@email.com',  'leon_smoker_insomnia_lipids'),
        ('maya.coleman@email.com',  'maya_asthma_anxiety'),
        ('dennis.harper@email.com', 'dennis_chf'),
        ('elena.ruiz@email.com',    'elena_migraine_dermatitis')
), allergy_templates(profile, sort_order, allergen, reaction, severity, noted_at) AS (
    VALUES
        ('tara_diabetes_htn', 1, 'Penicillin', 'Rash', 'Low', DATE '2001-02-09'),
        ('tara_diabetes_htn', 2, 'Shellfish', 'Lip itching', 'Low', DATE '2016-06-18'),
        ('leon_smoker_insomnia_lipids', 1, 'Iodinated contrast', 'Flushing', 'Moderate', DATE '2022-03-15'),
        ('leon_smoker_insomnia_lipids', 2, 'Penicillin', 'Rash', 'Low', DATE '1998-08-12'),
        ('maya_asthma_anxiety', 1, 'Pollen', 'Wheezing and itchy eyes', 'High', DATE '2015-04-20'),
        ('maya_asthma_anxiety', 2, 'Dust mites', 'Cough', 'Moderate', DATE '2015-04-20'),
        ('dennis_chf', 1, 'Sulfa antibiotics', 'Diffuse rash', 'High', DATE '2008-01-07'),
        ('dennis_chf', 2, 'Latex', 'Skin irritation', 'Low', DATE '2013-11-02'),
        ('elena_migraine_dermatitis', 1, 'Fragrance mix', 'Hand dermatitis flare', 'Moderate', DATE '2021-05-06'),
        ('elena_migraine_dermatitis', 2, 'Red dye', 'Headache trigger', 'Moderate', DATE '2022-09-14')
)
INSERT INTO patient_allergies (patient_id, allergen, reaction, severity, noted_at, sort_order)
SELECT p.id, t.allergen, t.reaction, t.severity, t.noted_at, t.sort_order
FROM patients p
JOIN new_patient_profiles npp ON npp.email = p.email
JOIN allergy_templates t ON t.profile = npp.profile;

WITH new_patient_profiles(email, profile) AS (
    VALUES
        ('tara.nguyen@email.com',   'tara_diabetes_htn'),
        ('leon.fischer@email.com',  'leon_smoker_insomnia_lipids'),
        ('maya.coleman@email.com',  'maya_asthma_anxiety'),
        ('dennis.harper@email.com', 'dennis_chf'),
        ('elena.ruiz@email.com',    'elena_migraine_dermatitis')
), condition_templates(profile, sort_order, condition_name, icd10_code, status, diagnosed_at, notes) AS (
    VALUES
        ('tara_diabetes_htn', 1, 'Type 2 diabetes mellitus', 'E11.9', 'Active', DATE '2020-07-18', 'A1c improving with lifestyle and metformin.'),
        ('tara_diabetes_htn', 2, 'Essential hypertension', 'I10', 'Active', DATE '2020-07-18', 'Home readings mostly controlled.'),
        ('leon_smoker_insomnia_lipids', 1, 'Dyslipidemia', 'E78.5', 'Active', DATE '2025-08-28', 'Started statin therapy.'),
        ('leon_smoker_insomnia_lipids', 2, 'Nicotine dependence', 'F17.210', 'Active', DATE '1997-06-03', 'Currently cutting down.'),
        ('leon_smoker_insomnia_lipids', 3, 'Insomnia', 'G47.00', 'Monitoring', DATE '2024-10-10', 'Sleep hygiene counseling started.'),
        ('maya_asthma_anxiety', 1, 'Mild intermittent asthma', 'J45.20', 'Active', DATE '2012-03-24', 'Triggered by exercise and seasonal allergens.'),
        ('maya_asthma_anxiety', 2, 'Generalized anxiety disorder', 'F41.1', 'Active', DATE '2023-01-12', 'Responding to SSRI.'),
        ('dennis_chf', 1, 'Heart failure', 'I50.9', 'Active', DATE '2024-12-22', 'Recent hospitalization, now euvolemic.'),
        ('dennis_chf', 2, 'Essential hypertension', 'I10', 'Active', DATE '2018-04-09', 'Needs close monitoring.'),
        ('elena_migraine_dermatitis', 1, 'Migraine', 'G43.909', 'Active', DATE '2019-08-01', 'Triggered by stress and red dye exposure.'),
        ('elena_migraine_dermatitis', 2, 'Dermatitis', 'L30.9', 'Active', DATE '2023-05-06', 'Hand dermatitis with fragrance exposure.')
)
INSERT INTO patient_conditions (patient_id, condition_name, icd10_code, status, diagnosed_at, notes, sort_order)
SELECT p.id, t.condition_name, t.icd10_code, t.status, t.diagnosed_at, t.notes, t.sort_order
FROM patients p
JOIN new_patient_profiles npp ON npp.email = p.email
JOIN condition_templates t ON t.profile = npp.profile;

WITH new_patient_profiles(email, profile) AS (
    VALUES
        ('tara.nguyen@email.com',   'tara_diabetes_htn'),
        ('leon.fischer@email.com',  'leon_smoker_insomnia_lipids'),
        ('maya.coleman@email.com',  'maya_asthma_anxiety'),
        ('dennis.harper@email.com', 'dennis_chf'),
        ('elena.ruiz@email.com',    'elena_migraine_dermatitis')
), medication_templates(profile, sort_order, medication_name, dose, route, frequency, status, started_at, instructions) AS (
    VALUES
        ('tara_diabetes_htn', 1, 'Metformin', '1000 mg', 'Oral', 'Twice daily', 'Active', DATE '2020-07-18', 'Take with meals.'),
        ('tara_diabetes_htn', 2, 'Losartan', '50 mg', 'Oral', 'Daily', 'Active', DATE '2020-07-18', 'Monitor home blood pressure.'),
        ('leon_smoker_insomnia_lipids', 1, 'Rosuvastatin', '20 mg', 'Oral', 'Nightly', 'Active', DATE '2025-08-28', 'Continue lifestyle changes.'),
        ('leon_smoker_insomnia_lipids', 2, 'Nicotine lozenge', '4 mg', 'Buccal', 'Every 2 hours as needed', 'PRN', DATE '2025-08-28', 'Use for smoking cravings.'),
        ('leon_smoker_insomnia_lipids', 3, 'Melatonin', '3 mg', 'Oral', 'At bedtime', 'Active', DATE '2025-08-28', 'Take 30 minutes before sleep.'),
        ('maya_asthma_anxiety', 1, 'Budesonide inhaler', '180 mcg', 'Inhaled', '1 puff twice daily', 'Active', DATE '2025-09-30', 'Rinse mouth after use.'),
        ('maya_asthma_anxiety', 2, 'Albuterol HFA', '90 mcg', 'Inhaled', '2 puffs as needed', 'PRN', DATE '2020-03-24', 'Use before exercise if needed.'),
        ('maya_asthma_anxiety', 3, 'Sertraline', '50 mg', 'Oral', 'Daily', 'Active', DATE '2025-09-30', 'Take with breakfast.'),
        ('dennis_chf', 1, 'Furosemide', '40 mg', 'Oral', 'Daily', 'Active', DATE '2024-12-22', 'Track daily weights and swelling.'),
        ('dennis_chf', 2, 'Carvedilol', '12.5 mg', 'Oral', 'Twice daily', 'Active', DATE '2024-12-22', 'Take with meals.'),
        ('dennis_chf', 3, 'Lisinopril', '20 mg', 'Oral', 'Daily', 'Active', DATE '2024-12-22', 'Call if dizzy or lightheaded.'),
        ('elena_migraine_dermatitis', 1, 'Sumatriptan', '50 mg', 'Oral', 'At migraine onset as needed', 'PRN', DATE '2025-10-24', 'May repeat once in 2 hours if needed.'),
        ('elena_migraine_dermatitis', 2, 'Triamcinolone 0.1% cream', 'Thin layer', 'Topical', 'Twice daily as needed', 'PRN', DATE '2025-10-24', 'Use on dermatitis flares only.')
)
INSERT INTO patient_medications (patient_id, medication_name, dose, route, frequency, status, started_at, instructions, sort_order)
SELECT p.id, t.medication_name, t.dose, t.route, t.frequency, t.status, t.started_at, t.instructions, t.sort_order
FROM patients p
JOIN new_patient_profiles npp ON npp.email = p.email
JOIN medication_templates t ON t.profile = npp.profile;

WITH risk_profiles(email, profile) AS (
    VALUES
        ('sarah.johnson@email.com',     'allergy'),
        ('michael.chen@email.com',      'cardiometabolic'),
        ('emily.williams@email.com',    'pain'),
        ('james.martinez@email.com',    'cardiometabolic'),
        ('aisha.patel@email.com',       'low_default'),
        ('robert.garcia@email.com',     'cardiometabolic'),
        ('catherine.liu@email.com',     'respiratory_mental'),
        ('thomas.anderson@email.com',   'pain'),
        ('diana.kowalski@email.com',    'migraine'),
        ('william.thompson@email.com',  'cardiometabolic_complex'),
        ('priya.sharma@email.com',      'low_default'),
        ('george.nakamura@email.com',   'neuro_fall'),
        ('angela.foster@email.com',     'mental_health'),
        ('marcus.washington@email.com', 'cardiac_anticoag'),
        ('helen.reeves@email.com',      'chf_readmit'),
        ('daniel.obrien@email.com',     'pain'),
        ('sophia.morales@email.com',    'mental_health'),
        ('frank.petrov@email.com',      'respiratory_smoker'),
        ('irene.chang@email.com',       'fall_oa'),
        ('laura.simmons@email.com',     'mental_health'),
        ('omar.hassan@email.com',       'cardiometabolic'),
        ('julia.bennett@email.com',     'allergy'),
        ('victor.alvarez@email.com',    'cardiac_secondary'),
        ('naomi.baker@email.com',       'migraine'),
        ('samuel.reed@email.com',       'respiratory_smoker'),
        ('tara.nguyen@email.com',       'cardiometabolic'),
        ('leon.fischer@email.com',      'respiratory_smoker'),
        ('maya.coleman@email.com',      'respiratory_mental'),
        ('dennis.harper@email.com',     'chf_readmit'),
        ('elena.ruiz@email.com',        'migraine')
), risk_templates(profile, sort_order, risk_name, level, details) AS (
    VALUES
        ('allergy', 1, 'Medication Sensitivity', 'Moderate', 'Allergy history requires medication review.'),
        ('allergy', 2, 'Anaphylaxis Risk', 'Low', 'Counseling needed when exposures escalate.'),
        ('cardiometabolic', 1, 'Cardiovascular Risk', 'Moderate', 'Chronic metabolic disease increases long-term risk.'),
        ('cardiometabolic', 2, 'Medication Risk', 'Low', 'Routine monitoring for adherence and side effects.'),
        ('pain', 1, 'Fall Risk', 'Low', 'Pain flares may reduce mobility and balance.'),
        ('pain', 2, 'Medication Risk', 'Low', 'Sedating medications used intermittently.'),
        ('low_default', 1, 'Medication Risk', 'Low', 'Minimal routine medication burden.'),
        ('respiratory_mental', 1, 'Respiratory Risk', 'Moderate', 'Monitor for exacerbations and rescue use.'),
        ('respiratory_mental', 2, 'Behavioral Health', 'Moderate', 'Symptoms can affect adherence and sleep.'),
        ('migraine', 1, 'Medication Overuse', 'Low', 'Monitor PRN therapy frequency.'),
        ('migraine', 2, 'Functional Impact', 'Moderate', 'Migraine flares can affect work and sleep.'),
        ('cardiometabolic_complex', 1, 'Renal Risk', 'Moderate', 'Kidney disease requires medication monitoring.'),
        ('cardiometabolic_complex', 2, 'Cardiovascular Risk', 'High', 'Diabetes and CKD increase complication risk.'),
        ('neuro_fall', 1, 'Fall Risk', 'High', 'Neurologic symptoms increase instability risk.'),
        ('neuro_fall', 2, 'Polypharmacy', 'Moderate', 'Multiple chronic medications require reconciliation.'),
        ('mental_health', 1, 'Behavioral Health', 'Moderate', 'Mood/anxiety symptoms need ongoing follow-up.'),
        ('mental_health', 2, 'Medication Risk', 'Low', 'Monitor response and side effects after titration.'),
        ('cardiac_anticoag', 1, 'Bleeding Risk', 'Moderate', 'Anticoagulation increases bleeding risk.'),
        ('cardiac_anticoag', 2, 'Cardiovascular Risk', 'High', 'Arrhythmia and hypertension require close monitoring.'),
        ('chf_readmit', 1, 'Readmission Risk', 'High', 'Heart failure history increases readmission risk.'),
        ('chf_readmit', 2, 'Fluid Balance', 'High', 'Requires weight and symptom monitoring.'),
        ('respiratory_smoker', 1, 'Respiratory Risk', 'High', 'Chronic lung disease and smoking increase exacerbation risk.'),
        ('respiratory_smoker', 2, 'Infection Risk', 'Moderate', 'Pulmonary infections can destabilize symptoms.'),
        ('fall_oa', 1, 'Fall Risk', 'Moderate', 'Joint pain may limit gait stability.'),
        ('fall_oa', 2, 'Medication Risk', 'Low', 'NSAID monitoring needed with chronic use.'),
        ('cardiac_secondary', 1, 'Cardiovascular Risk', 'High', 'Established CAD requires aggressive secondary prevention.'),
        ('cardiac_secondary', 2, 'Medication Risk', 'Moderate', 'Multiple cardiac medications need periodic review.')
)
INSERT INTO patient_risks (patient_id, risk_name, level, details, sort_order)
SELECT p.id, rt.risk_name, rt.level, rt.details, rt.sort_order
FROM patients p
JOIN risk_profiles rp ON rp.email = p.email
JOIN risk_templates rt ON rt.profile = rp.profile;
