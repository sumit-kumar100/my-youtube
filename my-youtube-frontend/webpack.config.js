module.exports = {
    resolve:{
        fallback: {
            util: require.resolve("util/"),
            fs: false
        }
    }
}