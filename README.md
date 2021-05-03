# Larry

Larry is a simple Discord bot that interacts with the OpenAI GTP3 API. The bot keeps track of the conversation per guild
individually. You need to supply your own GPT3 key for this to work. 
Larry currently
- only keeps the last 10 lines of a conversation, to limit token usage
- only reads 300 chars per message

## Commands

- `larry help`: show all available commands
- `larry reset`: reset the conversation
