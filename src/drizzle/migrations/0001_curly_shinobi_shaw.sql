CREATE TABLE `courses` (
	`courseId` integer PRIMARY KEY NOT NULL,
	`courseName` text NOT NULL,
	`semester` text NOT NULL,
	`groupName` text NOT NULL,
	`instructors` text DEFAULT (json_array()) NOT NULL,
	`languageOptions` text NOT NULL,
	`typeOfConduction` text NOT NULL,
	`yearOfStudy` text DEFAULT null,
	`syllabusLink` text DEFAULT null,
	`day` text,
	`period` text
);
--> statement-breakpoint
DROP TABLE `users`;