<template>
  <v-card flat style="background: transparent">
    <v-card-text>
      <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12 md12>
            <span class="labelStyled">{{ label }}:</span> {{ suggest }}
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
const COMPONENT_NAME = 'suggest';
export default {
  name: COMPONENT_NAME,
  props: [ 'form', 'field', 'model', 'to' ],
  data () {
    return {
      label: null,
      suggest: null,
      required: null
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.label = this.to.label ? this.to.label : 'Default label';
      this.suggest = this.to.value ? this.to.value : 'Default value suggested';
    });
  }
};
</script>
<style lang="scss">
  .titleModified {
    font-weight: 700;
  }
  .overflow {
    .input-group__selections {
      overflow: auto;
    }
  }
  .labelStyled {
    color: grey;
    margin-bottom: -25px;
  }
</style>

