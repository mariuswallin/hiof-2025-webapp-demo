CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`due_date` integer NOT NULL,
	`user_id` integer NOT NULL,
	`completed` integer DEFAULT false,
	`published` integer DEFAULT false,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_tasks_user_id` ON `tasks` (`user_id`);--> statement-breakpoint
CREATE INDEX `completed_idx` ON `tasks` (`completed`);