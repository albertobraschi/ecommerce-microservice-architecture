<?php

namespace Hamaca\Command;

use Hamaca\Model\Entity\Product;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class ProductCommand extends Command
{

    public function __construct()
    {
        parent::__construct();
    }

    protected function configure()
    {
        $this
            ->setName('product')
            ->setDescription('Add a new product')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $product = new Product();
        $product->save();
        $output->writeln("Product created with ID: " . $product->getId());
    }

}
