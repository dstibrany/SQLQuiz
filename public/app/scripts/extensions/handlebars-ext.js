require([
    "handlebars"
],

function(Handlebars) {
    // if equal
    Handlebars.registerHelper('if_eq', function(val, val2, block) {
        if (typeof block !== 'function')
            block = block.fn;
        if (val == val2)
            return block(this);
    });
    Handlebars.registerHelper('if_eq_round_down', function(val, val2, block) {
        if (typeof block !== 'function')
            block = block.fn;
        val = Math.floor(val);
        if (val == val2)
            return block(this);
    });

    // if not equal...
    Handlebars.registerHelper('if_neq', function(val, val2, block) {
        if (typeof block !== 'function') 
            block = block.fn;
        if (val !== val2)
            return block(this);
    });

    Handlebars.registerHelper('toDecimal', function(num) {
        return num.toFixed(1);
    });

});