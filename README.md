# PlatziStore

![Demo](./platzi.gif)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.8.

This project serves as a demonstration of an administrative panel for managing products in a fictional store.  

For user authentication (JWT token, Refresh token, Interceptor, Guards), a local server built with Express is used ([backend-express](https://github.com/pzaydulin/backend-express)). Data management is implemented using NgRx (although excessive for this use case, it is included for demonstration purposes).  

Product data is sourced from the [Platzi Fake Store API](https://fakeapi.platzi.com/).  

To handle data from multiple servers and bypass CORS restrictions for product image uploads, a proxy is utilized.  

Implemented features include:  
- Multi-page product list navigation  
- Bulk and individual product deletion  
- Product addition and editing  
- Image management (adding and removing product images)  


