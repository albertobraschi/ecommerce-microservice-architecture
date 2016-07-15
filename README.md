# Ecommerce Microservice Architecture

On early 2016 I started working on an e-commerce platform architecture that should have been the foundation of hamaca.io .

At that time I was studying microservice architectures and I thought that it was a good idea to develop my project as a microservice architecture from the beginning.

This repository contain an early experiment that lead me to conclude that it was not a good idea to start from scratch with such architecture. Thoug in the process I learned a lot about this domain.

# The idea

The idea is to divide every single business domain entity into a separate docker microservice. Each microservice can be implemented with a different technology, but they all must communicate through REST-like HTTP JSON API.

Every service is responsible for its own data.

# Requirements

To have this working, you need a docker environment and an internet connection.

# Build and test

To easily build and test everything, run the script:

```
./build-and-test.sh
```

# More

For more actions like running or destroying single services, please have a look at:

[CHEATSHEET.md](CHEATSHEET.md)