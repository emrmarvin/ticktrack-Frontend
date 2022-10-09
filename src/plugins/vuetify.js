import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

const vuetify = new Vuetify({
   theme: {
      themes: {
         light: {
            primary: '#004b8d',
            secondary: '#faa634',
            anchor: '#0079c1',
            background: '#ffffff',
            base: '#f5f5f5',
            text_color:'#000000',
            card: 'white',
            card_text:'black',
            sidebar: 'linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%)',
            primary_card: 'linear-gradient(to right top, #00afe9, #00a1e0, #0094d6, #0086cc, #0079c1)'
         },
         dark: {
            primary: '#004b8d',
            secondary: '#ffcf22',
            anchor: '#00afe9',
            text_color:'#FFFFFF',
            background: '#212330',
            base: '#18191b',
            card: '#18191b',
            card_text:'white',
         }, 
      }
   }
   
})

export default vuetify