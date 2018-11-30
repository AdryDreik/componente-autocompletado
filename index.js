import Component from './html/autocompletado-html.vue';

module.exports = {
  install: function (Vue, options) {
    Vue.component('a-autocomplete', Component);
  }
};