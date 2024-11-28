# Prizey

Prizey is a web application that allows users to search and save products from various online retailers. Users can create lists of products and set alerts for price changes on products and get notifications when the price of a product drops below a certain threshold. The project is under development and is not yet ready for production.

## Features

- User can search for products from various online retailers
- User can save products to a list
- User can set alerts for price changes on products
- User can get notifications when the price of a product drops below a certain threshold
- User can set schedules for when to check for price changes on their lists, particularly, when to scrape the price of a product, in the lists, from the retailer's website
- User can manage their profile, preferences, and notifications
- User can share their lists with others

## Client Routes

| Page             | Path           |
| ---------------- | -------------- |
| Landing page     | /              |
| Login page       | /login         |
| Dashboard        | /home          |
| Search page      | /search        |
| Search new page  | /search/new    |
| Search past page | /search/past   |
| List page        | /list          |
| List new page    | /list/new      |
| List all page    | /list/all      |
| Schedules page   | /schedule      |
| View schedules   | /schedule/view |
| Set alerts       | /alert         |
| Profile          | /profile       |
| Preferences      | /preferences   |
| Notifications    | /notifications |
| Share list       | /list/share    |

## Server Routes

| Route           | Method | Description                                               |
| --------------- | ------ | --------------------------------------------------------- |
| /scrape         | POST   | Scrape the price of a product from the retailer's website |
| /product        | POST   | Save products coming from scrape                          |
| /product        | GET    | Get products from the database                            |
| /product/:id    | GET    | Get a product by id                                       |
| /list           | POST   | Save a list of products                                   |
| /list           | GET    | Get lists from the database                               |
| /list/:id       | GET    | Get a list by id                                          |
| /list/:id       | PUT    | Update a list by id                                       |
| /list/:id       | DELETE | Delete a list by id                                       |
| /list/:id/share | POST   | Share a list by id                                        |
| /schedule       | POST   | Save a schedule                                           |
| /schedule       | GET    | Get schedules from the database                           |
| /schedule/:id   | GET    | Get a schedule by id                                      |
| /schedule/:id   | PUT    | Update a schedule by id                                   |
| /schedule/:id   | DELETE | Delete a schedule by id                                   |
