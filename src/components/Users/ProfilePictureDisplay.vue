<template>
    <div>
        <v-avatar size="100" class="mr-3" style="border:solid 3px white!important;">
                <img  v-if="imgscr" :src="'data:image/jpeg;base64,' + imgscr" alt="Profile Picture" class="image" style="border:solid 5px white!important;"/>  
                <v-icon size="150" v-if="!imgscr" style="border:solid 3px white!important;" color="white">mdi-account-circle</v-icon>
        </v-avatar>
    </div>
</template>
<script>
export default {
    name:"ProfilePictureDisplay",
    props:["imgscr",]
}
</script>
<style scoped>
.image{
    width:150px;
    height:150px;
}
</style>