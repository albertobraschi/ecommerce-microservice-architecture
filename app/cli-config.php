<?php
require_once "bootstrap-doctrine.php";

return \Doctrine\ORM\Tools\Console\ConsoleRunner::createHelperSet($entityManager);