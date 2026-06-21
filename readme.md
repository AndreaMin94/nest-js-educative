# NestJS educative course

## Building Secure RESTful APIs with NestJS: A Practical Guide

### 1. What is NestJS

- NestJS is a progressive NodeJS framework for building efficient, scalable, and maintainable applications.
- NodeJS is a runtime environment that allows for the executing of JavaScript code on the server side.

### 2. entry point

- The main.ts file is the entry point of the project. It bootstraps the application and sets up the runtime environment, including middleware and global configurations.
- The root module *app.module.ts* registers controllers and providers as AppController, AppService.

### 3. request life cycle

- An incoming request follows a predefined flow, passing through middlewares, guards, interceptors and pipes before it reaches the endpoint ( controller ) and generates response.
- **Middlewares:** can perform various tasks, such as transforming requests, redirecting routes, implementing caching mechanisms, applying rate limiting, and logging request-related data.
- **Guards:** used for authentication and authorization purposes.

### 4. Modules and dependency injection

- Modules act as containers for organizing and encapsulating code.
- DI simplifies managing dependencies and makes our code more modular.

#### 4.1. Modules

- Modular architecture means the code is organized into small, self-contained modules. A module is a class decorated by the *@Module* decorator. Within this class we can register controllers, services and other modules on which the module depends.

``` typescript
    @Module({
    imports: [CommonModule],
    controllers: [AddressBookController],
    providers: [AddressBookService],
    exports: [AddressBookService]
    })
    export class AddressBookModule {}
```

- *imports:* This is used to import other modules on which the current module depends.
- *controllers:* controllers that belongs to this module.
- *providers:* if we need to use a service from other module
- *exports:* allows to use components outside the module.

#### 4.2. DI

- NestJS provides a built-in DI to manage the dependencies between different components. DI allows us to declare the dependencies of a member and have them automatically resolved and injected at runtime.
_ NestJs DI is like a bucket where we put every class we will inject in other classes. This is possible by the *@Injectable* decorator.

``` typescript
    import { Injectable } from '@nestjs/common';

    @Injectable()
    export class AddressService {}
```

- After the declaration of the AddressService as injectable, it becomes a NestJs provider and we can register it in AppModule

``` typescript
    @Module({
        providers: [
            AddressService
        ],
    })
    export class AppModule {}
```

- Now AddressService is registered in NestJS DI and can be injected within the app

``` typescript
    @Controller('address')
    export class AddressController {
        constructor(private readonly addressService: AddressService) { }
    }
```

Now, when NestJS instantiates AddressController, it will create an instance of AddressService and cache it.

#### 4.3 Provider Scope

NestJS supports three main provider scopes:

- Singleton: A singleton provider is instantiated only once throughout the application. After the application has been bootstrapped, all singleton providers have been created.
- Request: Request-scoped providers are created per incoming requests.
- Transient: Transient providers are created each time they are requested.

``` typescript

// For every new HTTP request received, a new instance will be created
@Injectable({ scope: Scope.REQUEST })
export class RequestScopeService { }

// A new instance will be created every time it is requested or injected
@Injectable({ scope: Scope.TRANSIENT })
export class TransientScopeService {}

// A shared instance is used across the application
@Injectable({ scope: Scope.DEFAULT })
export class SingletonScopeService { }
```

Here are some typical use cases for each scope:

- Singleton scope: Most services are suitable for the default singleton scope. For example, a configuration service that loads application settings from a file and provides them to various components. A single instance ensures the same configuration data is shared across the application.

- Request scope: Specific situations, such as request tracking, require a request-based lifetime. One example is request tracking in a distributed microservices environment. Let’s say we need to log request headers, time stamps, and other request-specific details for an API with a microservices architecture. With request scope, we can create a new instance for each request, allowing each microservice to log request-specific details and context, making it easier to correlate and trace the path of a request as it moves from one microservice to another.

- Transient scope: This can be beneficial when we need independent instances with their state for different parts of the application. For example, consider LoggerService, which contains a consumer-specific prefix. To maintain individual prefixes for each consumer, we utilize the transient scope, ensuring that a new LoggerService instance is generated for each consumer. Consequently, the prefix property remains distinct and isn’t overridden.

## Project 01: Address-Book-Api

### Description

Explore building a secure and robust Address Book API with NestJS. Learn RESTful API design, CRUD operations with TypeORM and MySQL, JWT authentication, request validation, testing strategies, and deploying your API on AWS.

#### Step 1: Start the new NestJS project

``` shell
nest new 01-address-book-api
```

##### Entry point

The project entry point is the main.ts file in which the NestFactory and AppModule are imported. The NestFactory.create function create an app based on the modules used by the AppModule.

``` typescript
    import { NestFactory } from '@nestjs/core';
    import { AppModule } from './app.module';

    async function bootstrap() {
        const app = await NestFactory.create(AppModule);
        app.enableCors();
        await app.listen(3000);
    }

    bootstrap();
```

##### Module creation with NestJS CLI

The most common CLI command is the generate command.

With the *nest g resource address* command we create a new module with a boilerplate code like a controller, service, DTO, and module instead of creating manually these files individually.

Lets'create the first module AddressBook

``` bash
nest g module AddressBook
```

the command *nest g module ModuleName* create only the module file

``` typescript
    import { Module } from '@nestjs/common';

    @Module({})
    export class AddressBookModule {}
```

This command also updates the root module by adding imports of the new module

``` typescript
    import { Module } from '@nestjs/common';
    import { AppController } from './app.controller';
    import { AppService } from './app.service';
    import { AddressBookModule } from './address-book/address-book.module';

    @Module({
    imports: [AddressBookModule],
    controllers: [AppController],
    providers: [AppService],
    })
    export class AppModule {}

```

With the module only we won't go any further. We need files to manage the AddressBook logic. Let's start with the controller

``` shell
nest g controller Address
```

The AddressController controller will be generated as follows:

``` typescript
import { Controller } from '@nestjs/common';

@Controller('address')
export class AddressController {}
```

This controller will be added iin the AppModule, too

``` typescript
...
@Module({
  controllers: [AppController, AddressController],
  ...
})
...
```

Let's add a service

``` shell
nest g service Address
```

``` typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class AddressService {}
```

Move on with DTOs

NestJS CLI does not have commands to create DTOs, so we need to create manually.

Let's pretend we have a User class and we need a DTO to represent it

``` typescript

export class UserDto {
  userId: number;
  name: string;
  email: string;
}

```

We can use this representation in controllers

``` typescript
@Get()
findAll(): UserDto[] {
    return this.usersService.findAll();
}
```

We can extend DTOs to include other properties

``` typescript
export class CreateUserDto extends UserDto {
    password: string;
}
```

With the CreateUserDto class, the server API will know the data shape from the request body.

``` typescript
@Post()
create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
}
```

Here, the create method expects a request body from a POST request. The @Body decorator will extract the request body and deserialize it into a CreateUserDto instance. The DTO is then passed to the service to perform the user creation.

We will also create UpdateUserDto for updating the user.

``` typescript
import { PartialType } from '@nestjs/mapped-types';
import { UserDto } from './user.dto';

export class UpdateUserDto extends PartialType(UserDto) {}
```

NestJS provides the PartialType utility class. When we extend UpdateUserDto using PartialType, UpdateUserDto inherits all the properties from UserDto, which means it includes properties like firstName, lastName, and email. By applying PartialType, every property in UpdateUserDto becomes optional, allowing us to send partial data when updating resources.

The @nestjs/mapped-types package needs to be installed to get PartialType to work.

``` shell
npm i @nestjs/mapped-types --save
```

### Entity

An entity represents the structure and relationships of data objects in our NestJS app. They are used to interact with the underlying database.

In NestJS, the entity usually incorporates decorators from ORMs, such as TypeORM, to define the relationships and database-related properties.

``` typescript
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  @Column()
  id!: number;

  @Column()
  addressLine!: string;

  @Column()
  postCode!: string;

  @Column()
  state!: string;

  @Column()
  createdDate!: Date;
}

```

Get address by id endpoint

``` typescript
@Injectable()
export class AddressService {
  private addressDataStore: AddressDto[] = [];
  // Retrieves an address by its unique ID.
  getById(id: number) {
    // Finds an address in the 'addresses' store
    // where the 'id' property matches the provided 'id'.
    return this.addressDataStore.find(t => t.id === id);
  }
}
```

Create the getById endpoint

``` typescript
@Get(':id')
getById(@Param('id', ParseIntPipe) id: number): Address {
  return this.addressService.getById(id);
}
```
