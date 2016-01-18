<?php

namespace Hamaca\Model\Entity;
use Doctrine\ORM\EntityManager;

abstract class Entity
{

    private $entityManager;

    public function __construct(EntityManager $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function setEntityManager(EntityManager $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function getEntityManager()
    {
        return $this->entityManager;
    }

    public function save() {
        $this->entityManager->persist($this);
        $this->entityManager->flush();
    }

}
