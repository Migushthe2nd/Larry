# Larry

Larry is a simple Discord bot that interacts with the OpenAI GTP3 API. It also has support for different personalities
and even GPT2, served by booste. The bot keeps track of the conversation on a per-guild basis. You need to supply your
own OpenAI and booste API key for this to work.

- only keeps the last 10 lines of a conversation, to limit token usage
- only reads 400 chars per message

## Commands

- `larry help`: shows all available commands
- `larry status`: shows the current configuration
- `larry reset`: resets the conversation
- `larry switch`: switches between GTP2 and GPT3 (default: GPT3). Current conversation will be reset.
- `larry join`: Joins your current voice channel. Will use the same message history as the written messages.
- `larry leave`: Leaves the voice channel it is currently in.
- `larry personality <cheap/random/obedient/human>`: switches the GPT3 personality (default: human). Resets on every GPT
  switch.

## Personalities

The bot can have different personalities if you modify the source.  
[You can view the different personalities here](./src/GPT3/Personalities.js)

## Future Improvements

_none left_