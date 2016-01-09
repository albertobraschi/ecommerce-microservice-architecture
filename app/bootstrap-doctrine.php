<?php

use Doctrine\ORM\Tools\Setup;
use Doctrine\ORM\EntityManager;

require_once __DIR__ . "/../vendor/autoload.php";

// Create a simple "default" Doctrine ORM configuration for Annotations
$isDevMode = true;
$config = Setup::createAnnotationMetadataConfiguration(array(__DIR__."/../src"), $isDevMode);

// database configuration parameters
$connection = array(
    'driver' => 'pdo_sqlite',
    'path' => __DIR__ . '/../data/db.sqlite',
);

// obtaining the entity manager
$entityManager = EntityManager::create($connection, $config);
