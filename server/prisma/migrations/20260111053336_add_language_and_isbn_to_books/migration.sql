-- AlterTable
ALTER TABLE `Book` ADD COLUMN `isbn` VARCHAR(20) NULL,
    ADD COLUMN `language` VARCHAR(10) NOT NULL DEFAULT 'en';

-- AlterTable
ALTER TABLE `BookArchive` ADD COLUMN `isbn` VARCHAR(20) NULL,
    ADD COLUMN `language` VARCHAR(10) NOT NULL DEFAULT 'en';

-- CreateIndex
CREATE INDEX `Book_language_idx` ON `Book`(`language`);

-- CreateIndex
CREATE INDEX `BookArchive_language_idx` ON `BookArchive`(`language`);
