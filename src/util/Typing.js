const typingAndResolve = async (channel, promise) => {
    return new Promise(async (resolve) => {
        channel.startTyping().then();
        resolve(await promise);
        channel.stopTyping();
    });
};

module.exports.typingAndResolve = typingAndResolve;