let index = async ({ctx}) => {
    ctx.body = "migu index";
    console.log(ctx);
}

module.exports = {
    index
};