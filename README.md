
# Nerdy Best Friend Discord Bot

A booksmart Discord bot that offers friendly advice based on the books you have read. The bot can read PDFs, load them into Pinecone, and provide responses based on the content of the books.

## Features

- **PDF Upload**: Upload PDF books directly to the bot in your customized book discord channel.
- **Pinecone Integration**: Your book is then coverted into vectors and stored in Pinecone for efficient querying.
- **Friendly Advice**: Get responses and advice based on the books you have read.

## Installation

### Prerequisites

Ensure you have the following installed:

- Node.js
- npm (Node Package Manager)
- Discord account and bot token

### Steps

1. Clone the repository:
    ```bash
    git clone <repository_url>
    cd nerdy-friend
    ```
   
2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    - Create a `.env` file in the root directory.
    - Add your Discord bot token and other required environment variables:
      ```
      DISCORD_TOKEN_PINECONE=<your_discord_token>
      DISCORD_TOKEN_AI=<your_discord_token>
      ```

4. Run the bot:
    ```bash
    node index.js
    ```

## Usage

- **Uploading PDFs**: Upload a PDF to the Discord server where the bot is active. The bot will download the file, store it in Pinecone, and notify you once the process is complete.
- **Query Books**: Send a message, and the bot will respond with advice or information based on the content of the books stored.

### Example Commands

- Uploading a PDF:
  ```
  (Attach the PDF file in a message)
  ```
- Querying the bot:
  ```
  @nerdyfriend What is the summary of "Thinking, Fast and Slow"?
  ```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature/new-feature
    ```
3. Commit your changes:
    ```bash
    git commit -m 'Add new feature'
    ```
4. Push to the branch:
    ```bash
    git push origin feature/new-feature
    ```
5. Open a pull request.

## License

This project is licensed under the ISC License - see the LICENSE file for details.
