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
