CREATE TABLE `courses` (
	`courseId` integer PRIMARY KEY NOT NULL,
	`courseName` text NOT NULL,
	`semester` text NOT NULL,
	`groupName` text NOT NULL,
	`instructors` text NOT NULL,
	`languageOptions` text NOT NULL,
	`typeOfConduction` text,
	`targetYear` text,
	`syllabusLink` text DEFAULT null,
	`day` text,
	`period` text
);
