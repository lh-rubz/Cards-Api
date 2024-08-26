
Welcome to the Cards API! This API allows you to manage and interact with cards for different users. Below is a detailed description of each available endpoint, along with examples of requests and responses. The Postman collection file is attached for your convenience.

## API Endpoints

### 1. Add a Card to a User
- **Endpoint:** `POST /cards/user/:userId`
- **Description:** Adds a new card to the specified user.
- **URL:** `https://cardsapi.netlify.app/.netlify/functions/api/cards/user/:userId`
- **Request Body:**
json
  {
    "title": "Card Title",
    "completed": false
  }
- **Example Request:**
  POST https://cardsapi.netlify.app/.netlify/functions/api/cards/user/123
Content-Type: application/json

{
  "title": "New Card",
  "completed": false
}
- **Response**
{"userId": 123,
  "id": cardId,
  "title": "New Card",
  "completed": false
}
---------------------------
### 2. Edit a Card
- **Endpoint:** `PUT /cards/:id`
- **Description:** Updates the card details specified by the card ID.
- **URL:** `https://cardsapi.netlify.app/.netlify/functions/api/cards/:id`
- **Request Body:**
json
 {
  "title": "Updated Card Title",
  "completed": true,
  "userId": "userId"
}
- **Example Request:**
 PUT https://cardsapi.netlify.app/.netlify/functions/api/cards/124
Content-Type: application/json

{
  "title": "Updated Title",
  "completed": true,
  "userId": 123
}
- **Response**
{
  "id": 124,
  "title": "Updated Title",
  "completed": true,
  "userId": 123
}
---------------------------
### 3. Get All Cards
- **Endpoint:** `GET /cards`
- **Description:** Retrieves all cards.
- **URL:** `GET https://cardsapi.netlify.app/.netlify/functions/api/cards`

-**Example Request:**
 GET https://cardsapi.netlify.app/.netlify/functions/api/cards

- **Response**
[
  {
    "id": 1,
    "title": "Card Title 1",
    "completed": false,
    "userId": 10
  },
  {
    "id": 2,
    "title": "Card Title 2",
    "completed": true,
    "userId": 22
  }
]
---------------------------
### 4. Get All Cards for a Specific User
- **Endpoint:** `GET /cards/user/:userId`
- **Description:** Retrieves all cards associated with a specific user.
- **URL:** `https://cardsapi.netlify.app/.netlify/functions/api/cards/user/:userId`
- **Example Request:**
GET https://cardsapi.netlify.app/.netlify/functions/api/cards/user/123

-**Response**
[
  {
   "userId":123,
    "id": 3,
    "title": "Card Title 1",
    "completed": false
  },
  {"userId":123,
    "id": 4,
    "title": "Card Title 2",
    "completed": true
  }
]
---------------------------
### 5. Get a Card by ID
- **Endpoint:** `GET /cards/:id`
- **Description:** Retrieves a specific card by its ID.
- **URL:** `https://cardsapi.netlify.app/.netlify/functions/api/cards/:id`
- **Example Request:**
GET https://cardsapi.netlify.app/.netlify/functions/api/cards/124


- **Response**
{
  "id": 124,
  "title": "Card Title",
  "completed": true,
  "userId": 123
}
---------------------------
### 6. Delete a Card by ID
- **Endpoint:** `DELETE /cards/:id`
- **Description:** Deletes a specific card by its ID.
- **URL:** `https://cardsapi.netlify.app/.netlify/functions/api/cards/:id`
- **Example Request:**
DELETE https://cardsapi.netlify.app/.netlify/functions/api/cards/123



- **Response**
returns the rest of the cards without the deleted one.
[{
  "id": 124,
  "title": "Card Title",
  "completed": true,
  "userId": 123
}]

### Postman Collection
A Postman collection file is included with this documentation for easy testing of the API endpoints.
You can import the collection into Postman to interact with the API directly.
### Notes
Replace :userId and :id in the URL with the actual user ID and card ID as appropriate.
Ensure that the request body is in JSON format and contains the required fields for each endpoint.



  
