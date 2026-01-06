-- CreateTable
CREATE TABLE `BookArchive` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(200) NOT NULL,
    `author` VARCHAR(150) NULL,
    `imagePath` VARCHAR(300) NOT NULL,
    `firstAddedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastSeenAt` DATETIME(3) NOT NULL,
    `timesAdded` INTEGER NOT NULL DEFAULT 1,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,

    INDEX `BookArchive_title_idx`(`title`),
    INDEX `BookArchive_firstAddedAt_idx`(`firstAddedAt`),
    UNIQUE INDEX `BookArchive_title_author_key`(`title`, `author`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
