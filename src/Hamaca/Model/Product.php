<?php

namespace Hamaca\Model;

/**
 * @Entity
 * @Table(name="product")
 * @InheritanceType("SINGLE_TABLE")
 */
class Product extends HamacaModel
{

    /**
     * @Id @Column(type="integer") @GeneratedValue
     * @var int $id
     */
    private $id;

    public function __construct()
    {
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

}
