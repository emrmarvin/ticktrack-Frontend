<template>
<div>
    <v-row no-gutters justify="center" align="center">
      <v-col cols="8">
        <v-file-input
          show-size
          label="Select Image"
          accept="image/*"
          @change="selectImage"
        ></v-file-input>
      </v-col>

      <v-col cols="4" class="pl-2">
        <v-btn color="success" dark small @click="upload">
          Upload
          <v-icon right dark>mdi-cloud-upload</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <div v-if="progress">
      <div>
        <v-progress-linear
          color="light-blue"
          height="25"
          :value="progress"
        >
          <strong :disabled="true">{{ progress }} %</strong>
        </v-progress-linear>
      </div>
    </div>

    <div style="margin-top:10px" v-if="previewImage">
      <div>
        <img size="150" class="image" :src="previewImage" alt="" />
      </div>
    </div>

    <v-alert v-if="message" border="left" color="blue-grey" dark>
      {{ message }}

    </v-alert>
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      centered
      color="green"
      class="padding-left:10px"
    >
      <v-layout align-center pr-4>
        <v-layout column>
          <div style="text-align:center">Done uploading your photo<br>Click "Done"</div>
        </v-layout>
      </v-layout>
    </v-snackbar>

  </div>
  
</template>

<script>
import SparrowService from "../../services/SparrowService";

export default {
  name: "upload-image",
  props:[],
  data() {
    return {
     currentImage: undefined,
      previewImage: undefined,
      progress: 0,
      message: "",

      imageInfos: [],
      imagetest:"",
      snackbar:false,
      timeout:2000
    };
  },
  mounted(){
  },
  computed : {
    
  },
  methods: {
    selectImage(image) {
      this.currentImage = image;
      this.previewImage = URL.createObjectURL(this.currentImage);
      this.progress = 0;
      this.message = "";
    },
    upload() {
       if (!this.currentImage) {
        this.message = "Please select an Image!";
        return;
      }

      this.progress = 0;
      if(this.$store.state.IsNew == true){
         SparrowService.upload(true,this.currentImage,this.$store.state.userName,this.$store.state.userID,(event) => {
            this.progress = Math.round((100 * event.loaded) / event.total);
            this.snackbar = true
             if(this.progress == 100){
                this.snackbar = true
                // this.$store.state.isNew = false
                // console.log(this.$store.state.isNew)
              }
          })
      }else if(this.$store.state.IsNew == false){
         SparrowService.upload(false,this.currentImage,this.$store.state.userName,this.$store.state.userID,this.$store.state.profilePictureID,(event) => {
              this.progress = Math.round((100 * event.loaded) / event.total);
              if(this.progress == 100){
                this.snackbar = true
              }
            })
      }
    },
  }
};
</script>
<style scoped>
.image {
  width: 150px;
}

</style>