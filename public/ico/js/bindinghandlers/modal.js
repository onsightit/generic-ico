define(['knockout'], function(ko){
    ko.bindingHandlers.modal = {
        init: function(element, valueAccessor) {
            console.log('initing modal bindinghandler');
            $(element).modal({
                show: false
            });
            var value = valueAccessor();
            if (typeof value === 'function') {
                $(element).on('hide.bs.modal', function() {
                    value(false);
                });
            }
            // Update 13/07/2016
            // based on @Richard's finding,
            // don't need to destroy modal explicitly in latest bootstrap.
            // modal('destroy') doesn't exist in latest bootstrap.
            // ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            //    $(element).modal("destroy");
            // });
        },
        update: function(element, valueAccessor) {
            //console.log('update modal bindinghandler');
            var value = valueAccessor();
            if (ko.utils.unwrapObservable(value)) {
                $(element).modal('show');
            } else {
                $(element).modal('hide');
            }
        }
    };
});
