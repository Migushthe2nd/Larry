# Larry

Larry is a simple Discord bot that interacts with the OpenAI GTP3 API. The bot keeps track of the conversation per guild
individually. You need to supply your own GPT3 key for this to work. Larry currently

- only keeps the last 10 lines of a conversation, to limit token usage
- only reads 300 chars per message

## Commands

- `larry help`: show all available commands
- `larry reset`: reset the conversation
- `larry switch`: switch between GTP2 and GPT3 (default: GPT2). Current conversation will be reset.
- `larry personality <cheap/random/obedient/human>`: switch the GPT3 personality (default: cheap). Resets on every GPT
  switch.

## Personalities

The bot can have different personalities if you modify the source.

[You can view the different personalities here](./PERSONALITIES.md)

## Future Improvements

- Create a command to switch personalities
- Add toggle to switch between GPT2 and GPT3