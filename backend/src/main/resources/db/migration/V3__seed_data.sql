INSERT INTO patients (first_name, last_name, date_of_birth, gender, phone, email, address) VALUES
('Sarah',   'Johnson',  '1985-03-15', 'Female', '555-0101', 'sarah.johnson@email.com',  '123 Oak Street, Springfield, IL 62701'),
('Michael', 'Chen',     '1972-11-28', 'Male',   '555-0102', 'michael.chen@email.com',   '456 Maple Ave, Portland, OR 97201'),
('Emily',   'Williams', '1990-07-04', 'Female', '555-0103', 'emily.williams@email.com', '789 Pine Road, Austin, TX 78701'),
('James',   'Martinez', '1968-01-22', 'Male',   '555-0104', 'james.martinez@email.com', '321 Elm Blvd, Denver, CO 80201'),
('Aisha',   'Patel',    '1995-09-10', 'Female', '555-0105', 'aisha.patel@email.com',    '654 Cedar Lane, Seattle, WA 98101');

INSERT INTO notes (patient_id, content, author) VALUES
(1, 'Patient presents with mild seasonal allergies. Prescribed cetirizine 10mg daily. Follow up in 4 weeks.', 'Dr. Roberts'),
(1, 'Follow-up visit: allergy symptoms improved significantly. Continue current medication through spring season.', 'Dr. Roberts'),
(2, 'Annual physical exam. Blood pressure 128/82, BMI 24.5. All lab work within normal ranges. Recommended increased cardiovascular exercise.', 'Dr. Thompson'),
(3, 'Patient reports persistent lower back pain for 2 weeks. Physical exam reveals mild muscle tension. Prescribed physical therapy 2x/week for 6 weeks.', 'Dr. Garcia'),
(4, 'Routine diabetes management visit. HbA1c at 6.8%, well controlled. Continue metformin 500mg twice daily. Schedule follow-up in 3 months.', 'Dr. Kim'),
(5, 'New patient intake. Complete medical history obtained. No significant past medical history. Family history of hypertension. Baseline labs ordered.', 'Dr. Roberts');
