The parameters of the bot can be tuned. Here are a few different personalities:

### Works with random questions, a bit random and repetitive:

```js
openai.complete({
    engine: "davinci",
    temperature: 0.8,
    maxTokens: 80,
    topP: 1.0,
    frequencyPenalty: 0.6,
    presencePenalty: 0.3,
});
```

### Really follows the conversation and gets confused by random questions, logical answers, can be explicit, less repetitive:

```js
openai.complete({
    engine: "davinci",
    temperature: 1.0,
    maxTokens: 80,
    topP: 1.0,
    frequencyPenalty: 1.0,
    presencePenalty: 1.0,
});
```