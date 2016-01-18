<?php

namespace Hamaca\Model\Entity;

/**
 * @Entity
 * @Table(name="product")
 * @InheritanceType("SINGLE_TABLE")
 */
class Product extends Entity
{

    /**
     * @Id @Column(type="integer") @GeneratedValue
     * @var int $id
     */
    private $id;

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

}
