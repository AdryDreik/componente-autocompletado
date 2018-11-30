'use strict';
/* eslint no-new-func:0 */
import validate from 'validate.js';
export default {
  async created() {
    this.component = (this.field && this.field.type) ? this.field.type : this.type;
    if (this.component) {
      this.$service.get(`validaciones/${this.component}-all`)
        .then(async (res) => {
          await this.createRules(res.listado);
        })
        .catch((err) => this.$message.error(err.message));
    }
  },
  data() {
    return {
      component: null,
      rules: {},
      customRules: [],
      listValidations: [],
      selected: []
    };
  },
  methods: {
    async armValidation() {
      try {
        this.customRules = [];
        if (this.to && Array.isArray(this.to.validations)) {
          for (let item of this.to.validations) {
            if (this.component) {
              if (this.component.includes('autocompletado') || this.component.includes('lista_desplegable')) {
                if (item && item.titulo.toString().trim().length > 1) {
                  if (!item.titulo.includes('requerido')) {
                    this.customRules.push(this.rules[item.titulo]);
                  }
                } else {
                  this.customRules.push(this.rules[item.titulo]);
                }
              } else {
                if (item && item.titulo && item.titulo.toString().trim().length > 1) {
                  this.customRules.push(this.rules[item.titulo]);
                }
              }
              if (item && item.titulo && item.titulo.toString().trim().length > 1) {
                this.selected.push(item.titulo);
              }
            }
          }
        }
      } catch (err) {
        this.$message.error(err.message);
      }
    },
    async createRules(rules) {
      try {
        const a = [];
        for (let b of rules) {
          if (!b.multiple) {
            if (b.titulo) {
              a[b.titulo] = (value) => {
                if (b.validacion.funcion) {
                  const fn = new Function('value', b.validacion.funcion);
                  b.validacion = fn;
                } else if (b.validacion.format && b.validacion.format.pattern) {
                  b.validacion.format.pattern = new RegExp(b.validacion.format.pattern);
                }
                let constraints = {
                  [b.titulo]: b.validacion
                };
                const isValid = validate({
                  [b.titulo]: value || null
                }, constraints);
                return (isValid) ? `${isValid[b.titulo]}` : true;
              };
              this.listValidations.push({
                titulo: b.titulo,
                id: b._id
              });
            }
            this.rules = a;
          } else {
            const x = [];
            for (let y of Object.keys(b.validacion)) {
              if (y.titulo) {
                x[y] = (value) => {
                  if (b.validacion[y].funcion) {
                    const fn = new Function('value', b.validacion[y].funcion);
                    b.validacion[y] = fn;
                  } else if (b.validacion[y].format && b.validacion[y].format.pattern) {
                    b.validacion[y].format.pattern = new RegExp(b.validacion[y].format.pattern);
                  }
                  let constraints = {
                    [y]: b.validacion[y]
                  };
                  const isValid = validate({
                    [y]: value || null
                  }, constraints);
                  return (isValid) ? `${isValid[y]}` : true;
                };
                this.listValidations.push({
                  titulo: y.titulo,
                  id: y._id
                });
              }
            }
            this.rules = x;
          }
        }
      } catch (err) {
        this.$message.error(err.message);
      }
      await this.armValidation();
    }
  },
  watch: {
    selected(rule) {
      if (this.to && this.to.validations) {
        const rulesWithId = [];
        for (let elem of rule) {
          const findIdRule = this.listValidations.filter((item) => item.titulo === elem);
          if (findIdRule) {
            rulesWithId.push(findIdRule[0]);
          }
        }
        this.to.validations = rulesWithId;
      }
      if (Array.isArray(rule) && rule.length > 0) {
        this.customRules = [];
        rule.reduce((a, b) => {
          a.push(this.rules[b]);
          return a;
        }, this.customRules);
      }
    }
  }
};
