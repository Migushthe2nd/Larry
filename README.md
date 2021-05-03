# Larry

Larry is a simple Discord bot that interacts with the OpenAI GTP3 API. It also has support for different personalities
and even GPT2, served by booste. The bot keeps track of the conversation on a per-guild basis. You need to supply your
own OpenAI and booste API key for this to work.

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
[You can view the different personalities here](./src/GPT3/Personalities.js)

## Future Improvements

_none left_