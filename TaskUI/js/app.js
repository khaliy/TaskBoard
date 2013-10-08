(function () {

    // disable warning about no-js
    $(".page-index .warning").hide();

    /*
     * Utility from
     * https://gist.github.com/derickbailey/1752642#file-2-js
     */
    var TemplateManager = {
        templates: {},
        get: function(id, callback){
            var template = this.templates[id];
            if (template) {
                callback(template);
            } else {
                $.get("templates/" + id + ".html", $.proxy(function(template) {
                    var $tmpl = $(template);
                    this.templates[id] = $tmpl;
                    callback($tmpl);
                }, this));
            }
        }
    };

    var NavigationModel = Backbone.Model.extend({
        PAGES: ["index", "task", "filter", "board"],
        url: "api/1/page",
        setPage: function (page) {
            if (this.PAGES.indexOf(page)!== -1) {
                this.set("page", page);
                this.save();
            }
        }
    });

    var HistoryRouter = Backbone.Router.extend({
        routes: {
            ":page": "navigate"
        },
        navigate: function(page) {
            this.trigger("change:page", {page: page});
        }
    });

    var NavigationView = Backbone.View.extend({
        el: "nav",
        initialize: function() {
            this.listenTo(this.model, "change", this.render);
            this.historyRouter = new HistoryRouter();
            this.historyRouter.on("change:page", $.proxy(this.navigate, this));
            Backbone.history.start();
        },
        navigate: function(e) {
            var page = $(e.target).data("page") || e.page;
            this.model.setPage(page);
            return this;
        },
        render: function() {
            var $pages = $(".page"),
                current = this.model.get("page");
                $currentSection = $pages.filter(".page-" + current);
            if ($currentSection.hasClass("template")) {
                TemplateManager.get(current, $.proxy(function ($template) {
                    $pages.not($currentSection).hide();
                    $currentSection.removeClass("template").empty().append($template);
                    $currentSection.show();
                }, this));
            } else {
                $pages.not($currentSection).hide();
                $currentSection.show();
            }
            return this;
        }
    });

    var navModel = new NavigationModel(),
        navView = new NavigationView({
            model: navModel
        });

}());