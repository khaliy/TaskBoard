var express = require('express'),
    fw = express(),
    PORT = 9000,
    app = {};

app.Model = function (defaults) {
    this.models = defaults && defaults.models || {};
};
app.Model.prototype = {
    save: function (model, value) {
        this.models[model] = value;
    },
    get: function (model) {
        return this.models[model];
    }
};

fw.use(express.static(__dirname + '/../TaskUI/'));
fw.use(express.cookieParser());
fw.use(express.session({secret: 'kndslOkjvbs!jhdSl34iu9+_dskljnsdf342_981'}));
fw.use(express.logger());

fw.use(express.bodyParser());

fw.get('/info.txt', function(req, res){
    res.send('TaskServer module');
});

fw.all('/api/1/:model', function(req, res){
    var model = new app.Model(req.session.model),
        value;
    switch (req.method) {
        case 'POST':
            model.save(req.params.model, req.body);
            break;
        case 'GET':
            value = model.get(req.params.model) || {};
            break;
    }
    res.send(value);
});


fw.listen(PORT);
console.log("Server started on port " + PORT);
