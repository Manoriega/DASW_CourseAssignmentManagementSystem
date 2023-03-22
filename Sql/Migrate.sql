CREATE DATABASE `courseassignmentsystem` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

CREATE TABLE `courseassignmentsystem`.`users` (
  `id` INT NOT NULL,
  `user_type` INT NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(15) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `apellido_p` VARCHAR(45) NULL,
  `apellido_m` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `courseassignmentsystem`.`groups` (
  `id` INT NOT NULL,
  `teacher_id` INT NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `description` VARCHAR(200) NULL,
  `creation_date` DATE NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `teacher_id_idx` (`teacher_id` ASC) VISIBLE,
  CONSTRAINT `teacher_id`
    FOREIGN KEY (`teacher_id`)
    REFERENCES `courseassignmentsystem`.`users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT);

CREATE TABLE `courseassignmentsystem`.`student_group` (
  `id` INT NOT NULL,
  `group_id` INT NOT NULL,
  `student_id` INT NOT NULL,
  `creation_date` DATE NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `group_id_idx` (`group_id` ASC) VISIBLE,
  INDEX `student_id_idx` (`student_id` ASC) VISIBLE,
  CONSTRAINT `group_id`
    FOREIGN KEY (`group_id`)
    REFERENCES `courseassignmentsystem`.`groups` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `student_id`
    FOREIGN KEY (`student_id`)
    REFERENCES `courseassignmentsystem`.`users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT);

CREATE TABLE `courseassignmentsystem`.`rubrics` (
  `id` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `created_date` DATE NOT NULL,
  PRIMARY KEY (`id`));


CREATE TABLE `courseassignmentsystem`.`assignments` (
  `id` int NOT NULL,
  `group_id` int NOT NULL,
  `rubric_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `creation_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `group_id_idx` (`group_id`),
  KEY `assignment_rubric_id_idx` (`rubric_id`),
  CONSTRAINT `assignment_group_id` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `assignment_rubric_id` FOREIGN KEY (`rubric_id`) REFERENCES `rubrics` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `courseassignmentsystem`.`assignment_entry` (
  `id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `assignment_id` INT NOT NULL,
  `file_name` VARCHAR(20) NOT NULL,
  `score` INT NULL,
  `creation_date` DATE NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `assignment_entry_user_id_idx` (`user_id` ASC) VISIBLE,
  INDEX `assignment_entry_assignment_id_idx` (`assignment_id` ASC) VISIBLE,
  CONSTRAINT `assignment_entry_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `courseassignmentsystem`.`users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `assignment_entry_assignment_id`
    FOREIGN KEY (`assignment_id`)
    REFERENCES `courseassignmentsystem`.`assignments` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT);

CREATE TABLE `courseassignmentsystem`.`rubric_questions` (
  `id` INT NOT NULL,
  `rubric_id` INT NOT NULL,
  `question` VARCHAR(150) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `rubric_question_rubric_id_idx` (`rubric_id` ASC) VISIBLE,
  CONSTRAINT `rubric_question_rubric_id`
    FOREIGN KEY (`rubric_id`)
    REFERENCES `courseassignmentsystem`.`rubrics` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT);


CREATE TABLE `courseassignmentsystem`.`evaluations` (
  `id` INT NOT NULL,
  `evaluating_user_id` INT NOT NULL,
  `evaluated_user_id` INT NOT NULL,
  `assignment_id` INT NOT NULL,
  `creation_date` DATE NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `evaluation_user_evaluating_idx` (`evaluating_user_id` ASC) VISIBLE,
  INDEX `evaluation_user_evaluated_idx` (`evaluated_user_id` ASC) VISIBLE,
  INDEX `evaluation_assignment_id_idx` (`assignment_id` ASC) VISIBLE,
  CONSTRAINT `evaluation_user_evaluating`
    FOREIGN KEY (`evaluating_user_id`)
    REFERENCES `courseassignmentsystem`.`users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `evaluation_user_evaluated`
    FOREIGN KEY (`evaluated_user_id`)
    REFERENCES `courseassignmentsystem`.`users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `evaluation_assignment_id`
    FOREIGN KEY (`assignment_id`)
    REFERENCES `courseassignmentsystem`.`assignments` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT);

CREATE TABLE `courseassignmentsystem`.`rubrics_answers` (
  `id` INT NOT NULL,
  `evaluation_id` INT NOT NULL,
  `rubric_question_id` INT NOT NULL,
  `answer` TINYINT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `answer_evaluation_id_idx` (`evaluation_id` ASC) VISIBLE,
  INDEX `answer_question_id_idx` (`rubric_question_id` ASC) VISIBLE,
  CONSTRAINT `answer_evaluation_id`
    FOREIGN KEY (`evaluation_id`)
    REFERENCES `courseassignmentsystem`.`evaluations` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `answer_question_id`
    FOREIGN KEY (`rubric_question_id`)
    REFERENCES `courseassignmentsystem`.`rubric_questions` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT);



