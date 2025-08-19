# Liquibase

#### Execution command: liquibase update --defaults-file=defaults.properties

## Changelog

#### 8/11/2023 - Inital creation

-   Setup Initial configuration, connected to DB
-   Added table: `users`
-   Added table: `sessions`
-   Added table: `characters`

#### 11/20/2023 - Added foreign keys

-   Added table `usage`
-   Added column "likes" to table `characters`
-   Added column "dislikes" to table `characters`
-   Added column "reports" to table `characters`

#### 02/12/2024 - Added private flag for characters

-   Added column "is_private" to table `characters`

#### 02/18/2024 - Added delete character function

-   Added Added delete character function for table `characters`
