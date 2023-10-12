import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: 'mdi',
    },
    theme: {
      themes: {
        light: {
          primary: '#B55B68', // This is the primary color
          // other color definitions...
        },
      },
    },
  });
