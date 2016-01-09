<?php

namespace Hamaca\Model;
use Doctrine\ORM\EntityManager;

abstract class HamacaModel
{

    /**
     * @var EntityManager
     */
    private $entityManager;

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
