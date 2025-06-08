# PlatziStore

![Demo](./platzi.gif)

This project serves as a demonstration of an administrative panel for managing products in a fictional store.  

For user authentication (**JWT token, Refresh token, Interceptor, Guards**), a local server built with **Express** is used ([backend-express](https://github.com/pzaydulin/backend-express)). Data management is implemented using **NgRx** (although excessive for this use case, it is included for demonstration purposes).  

Product data is sourced from the [Platzi Fake Store API](https://fakeapi.platzi.com/).  

To handle data from multiple servers and bypass CORS restrictions for product image uploads, a proxy is utilized.  

Implemented features include:  
- Multi-page product list navigation  
- Bulk and individual product deletion  
- Product addition and editing  
- Image management (adding and removing product images)  

Uses: ***Angular 18.2, NgRX 18.1, PrimeNG 17.18, TailwindCSS 3.4*** 
