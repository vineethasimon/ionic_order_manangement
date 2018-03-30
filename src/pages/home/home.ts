import { Component } from '@angular/core';
import { NavController, AlertController ,LoadingController} from 'ionic-angular';
import { BarcodeScanner} from 'ionic-native';
import { Camera } from 'ionic-native';
import { Http } from '@angular/http';

import { Base64 } from '@ionic-native/base64';

import 'rxjs/add/operator/map'
import { SpeechRecognition } from '@ionic-native/speech-recognition';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})



export class HomePage {
  text:String[];
  srcImage: string;
  product: any[];
  array:any[];  
  str:String="";
  // filePath:'../../assets/imgs/demo.png';
  base64F:any;
  // loading:any;
  filePath: string = '../../assets/imgs/demo.png';
  constructor(private base64: Base64, public navCtrl: NavController, public http: Http, public alertCtrl: AlertController,private speechRecognition: SpeechRecognition, public loading:LoadingController) { 
    http.get('assets/json/response.json').map(res => res.json()).subscribe(data => {
      
          this.product = data.map(data=>data);
          this.array = data.map(data=>data);
        })
    
  }
   onInput(){

    // if(i.data!=null){
    //   this.str=this.str.concat(i.data)
    // }
    // else if(i.data==null){
    //   this.str=this.str.slice(0,-1)
    // }
  //  console.log(this.str)
   this.product=this.array.filter((event)=>{
      if((event.product_name.toLowerCase().indexOf(this.str.toLowerCase()) > -1)||event.product_id.indexOf(this.str)>-1){
        return true;
      }
      return false; 
    })
  }
  async onClear(){
    this.str="";
    this.onInput();
  }

  clickForBarcode() {
    BarcodeScanner.scan()
      .then((result) => {
        this.str=result.text;
        alert(
          "We got a barcode\n" +
          "Result: " + result.text + "\n" +
          "Format: " + result.format + "\n" +
          "Cancelled: " + result.cancelled
        )
        this.onInput();
       
      })
      .catch((error) => {
        alert(error);
      })
  }
  async clickForOCR() {
    // this.srcImage = '../../assets/imgs/demo.png'
    // Camera.getPicture({
    //   quality: 100,
    //   destinationType: 0, // DATA_URL
    //   sourceType: 1,
    //   allowEdit: true,
    //   saveToPhotoAlbum: false,
    //   correctOrientation: true,
    //   encodingType: Camera.EncodingType.PNG,
    //   mediaType: Camera.MediaType.PICTURE
    // }).then((imageData) => {
    // console.log(imageData);
      // this.srcImage = `data:image/png;base64,${imageData}`;
      // setTimeout(() => {
      //   (<any>window).OCRAD(document.getElementById('image'), text => {
      //     alert(text);
      //   });
      // }, 1000);

      this.base64.encodeFile(this.filePath).then((base64File: string) => {
        console.log(base64File);
        this.base64F= base64File;
      }, (err) => {
        console.log(err);
      });
        let alertType = this.alertCtrl.create({
        title: 'Scan Image for:',
        buttons: [
          {
            text: 'OCR',
            handler: () => {

              let loading = this.loading.create({
                content: 'Please wait...'
              });
            
              loading.present();
          //  console.log("base64"+this.base64F);
              const body = {
                "requests": [
                  {
                    "image": {
                      "content": "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",
                    },
                    "features": [
                      {
                        "type": "DOCUMENT_TEXT_DETECTION",
                      }
                    ]
                  }
                ]
              }
              this.http.post("https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDAi4IYxh4mSTyCJhkg5Opz7ZW2OBLyovI",body)
              .subscribe(data=>{
                // console.log("***"+(data.json().response));
                this.str=data.json().responses["0"].fullTextAnnotation.text.replace(/\r?\n|\r/g,"");

                // console.log(this.str);
                var sam='';
                var url="https://translation.googleapis.com/language/translate/v2?q="+this.str+"&target=en&key=AIzaSyDAi4IYxh4mSTyCJhkg5Opz7ZW2OBLyovI";
                      console.log(url);
                      this.http.post(url,sam)
                
                      .subscribe(dataT=>{
                
                        console.log(dataT.json().data.translations["0"].translatedText);
                
                 
                   
                // this.str=data.json().responses["0"].labelAnnotations["0"].description;
                loading.dismiss();
                let alert = this.alertCtrl.create({
                  title: 'Scanned Data',
                  message: 'Please confirm scanned data',
                  inputs: [
                    {
                      name: 'title',
                      placeholder: 'Title',
                      value: (dataT.json().data.translations["0"].translatedText),
                    },
                  ],
                  buttons: [
                    {
                      text: 'Cancel',
                      handler: () => {
                        console.log('Cancel clicked');
                      }
                    },
                    {
                      text: 'Save',
                      handler: (value) => {
                        console.log('Saved clicked'+value.title);
                      }
                    }
                  ]
                });
                
                alert.present();
                this.onInput();
              });
});  


             
            }
          },
          {
            text: 'Object Detection',
            handler: (value) => {


              let loading = this.loading.create({
                content: 'Please wait...'
              });
            
              loading.present();
          
              const body = {
                "requests": [
                  {
                    "image": {
                      "content":  this.srcImage
                    },
                    "features": [
                      {
                        "type": "LABEL_DETECTION",
                        "maxResults":1
                      }
                    ]
                  }
                ]
              }
              this.http.post("https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDAi4IYxh4mSTyCJhkg5Opz7ZW2OBLyovI",body)
              .subscribe(data=>{
                console.log(data.json().response);
                // this.str=data.json().responses["0"].fullTextAnnotation.text.replace(/\r?\n|\r/g,"");
                this.str=data.json().responses["0"].labelAnnotations["0"].description;
                loading.dismiss();
                let alert = this.alertCtrl.create({
                  title: 'Scanned Data',
                  message: 'Please confirm scanned data',
                  inputs: [
                    {
                      name: 'title',
                      placeholder: 'Title',
                      value:data.json().responses["0"].labelAnnotations["0"].description,
                    },
                  ],
                  buttons: [
                    {
                      text: 'Cancel',
                      handler: () => {
                        console.log('Cancel clicked');
                      }
                    },
                    {
                      text: 'Save',
                      handler: (value) => {
                        console.log('Saved clicked'+value.title);
                      }
                    }
                  ]
                });
                
                alert.present();
                this.onInput();
              });




              
            }
          }
        ]
      });
      
      alertType.present();









      
    // }, (err) => {
    //   console.log(`ERROR -> ${JSON.stringify(err)}`);
    // });
  }
  clickForSpeech(){
    this.speechRecognition.hasPermission().then((hasPermission: boolean) => console.log(hasPermission));
     this.speechRecognition.startListening().subscribe(data=>{
      this.text=data;
      alert(this.text)
      this.str=this.text[0].replace(/ /g,"")
      this.onInput();
      setTimeout(() => {
        this.speechRecognition.stopListening();
      }, 10);
     }
      );
     
   }






}



